/**
 * Performance detection and optimization utilities
 */

// Device capabilities interface
export interface DeviceCapabilities {
  cores: number;
  memory: number;
  isMobile: boolean;
  isLowEnd: boolean;
  connection: string;
  pixelRatio: number;
  touchSupport: boolean;
}

// Detect device capabilities
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );
  
  const cores = navigator.hardwareConcurrency || 2;
  
  // @ts-ignore - deviceMemory is not in all browsers
  const memory = navigator.deviceMemory || 4;
  
  // @ts-ignore - connection is experimental
  const connection = navigator.connection?.effectiveType || 'unknown';
  
  const pixelRatio = window.devicePixelRatio || 1;
  
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Determine if device is low-end
  const isLowEnd = isMobile || cores < 4 || memory < 4;

  return {
    cores,
    memory,
    isMobile,
    isLowEnd,
    connection,
    pixelRatio,
    touchSupport,
  };
};

// Check if device can handle heavy animations
export const canHandleHeavyAnimations = (): boolean => {
  const capabilities = detectDeviceCapabilities();
  
  // Disable heavy animations on low-end devices
  if (capabilities.isLowEnd) return false;
  
  // Disable on slow connections
  if (capabilities.connection === 'slow-2g' || capabilities.connection === '2g') {
    return false;
  }
  
  return true;
};

// Get optimal particle count based on device
export const getOptimalParticleCount = (): number => {
  const capabilities = detectDeviceCapabilities();
  
  if (capabilities.isLowEnd) {
    return 1000; // Low-end devices
  } else if (capabilities.cores >= 8 && capabilities.memory >= 8) {
    return 5000; // High-end devices
  } else {
    return 3000; // Mid-range devices
  }
};

// Get optimal quality settings
export const getOptimalQualitySettings = () => {
  const capabilities = detectDeviceCapabilities();
  
  return {
    shadows: !capabilities.isLowEnd,
    antialias: !capabilities.isLowEnd,
    pixelRatio: capabilities.isLowEnd ? 1 : Math.min(capabilities.pixelRatio, 2),
    particleCount: getOptimalParticleCount(),
    enablePostProcessing: !capabilities.isLowEnd,
    enableBloom: !capabilities.isLowEnd,
  };
};

// Measure frame rate
export const measureFPS = (duration: number = 1000): Promise<number> => {
  return new Promise((resolve) => {
    let frames = 0;
    const startTime = performance.now();

    const countFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - startTime < duration) {
        requestAnimationFrame(countFrame);
      } else {
        const fps = Math.round((frames * 1000) / (currentTime - startTime));
        resolve(fps);
      }
    };

    requestAnimationFrame(countFrame);
  });
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Check if reduced motion is preferred
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Lazy load images
export const lazyLoadImage = (img: HTMLImageElement): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      resolve();
    } else {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image failed to load'));
    }
  });
};

// Get memory usage (if available)
export const getMemoryUsage = (): { used: number; total: number } | null => {
  // @ts-ignore - memory is Chrome-specific
  if (performance.memory) {
    // @ts-ignore
    return {
      // @ts-ignore
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      // @ts-ignore
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
    };
  }
  
  return null;
};

// Performance monitor class
export class PerformanceMonitor {
  private fps: number = 0;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private isMonitoring: boolean = false;

  start() {
    this.isMonitoring = true;
    this.monitor();
  }

  stop() {
    this.isMonitoring = false;
  }

  getFPS(): number {
    return Math.round(this.fps);
  }

  private monitor = () => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime >= this.lastTime + 1000) {
      this.fps = (this.frameCount * 1000) / (currentTime - this.lastTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    requestAnimationFrame(this.monitor);
  };
}

export default {
  detectDeviceCapabilities,
  canHandleHeavyAnimations,
  getOptimalParticleCount,
  getOptimalQualitySettings,
  measureFPS,
  debounce,
  throttle,
  prefersReducedMotion,
  lazyLoadImage,
  getMemoryUsage,
  PerformanceMonitor,
};
