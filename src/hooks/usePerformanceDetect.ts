import { useState, useEffect } from 'react';

export const usePerformanceDetect = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const cores = navigator.hardwareConcurrency || 2;
      const memory = (navigator as any).deviceMemory || 4;
      
      // Disable heavy animations on low-end devices
      const lowPerf = isMobile || cores < 4 || memory < 4;
      setIsLowPerformance(lowPerf);
    };

    checkPerformance();
  }, []);

  return { isLowPerformance, enableHeavyAnimations: !isLowPerformance };
};
