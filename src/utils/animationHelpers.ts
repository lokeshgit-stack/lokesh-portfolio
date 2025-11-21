import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animation helper utilities for GSAP
 */

// Animation preset types
export type AnimationType = 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';

// Easing presets
export const EASINGS = {
  power1: 'power1.out',
  power2: 'power2.out',
  power3: 'power3.out',
  power4: 'power4.out',
  back: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  bounce: 'bounce.out',
  sine: 'sine.inOut',
  expo: 'expo.out',
} as const;

// Get animation properties based on type
export const getAnimationProps = (type: AnimationType) => {
  const animations = {
    fade: { opacity: 0 },
    slideUp: { opacity: 0, y: 100 },
    slideDown: { opacity: 0, y: -100 },
    slideLeft: { opacity: 0, x: 100 },
    slideRight: { opacity: 0, x: -100 },
    scale: { opacity: 0, scale: 0.5 },
    rotate: { opacity: 0, rotation: 45 },
  };

  return animations[type] || animations.fade;
};

// Create fade in animation
export const fadeIn = (
  element: gsap.DOMTarget,
  duration: number = 1,
  delay: number = 0,
  ease: string = EASINGS.power3
) => {
  return gsap.from(element, {
    opacity: 0,
    duration,
    delay,
    ease,
  });
};

// Create slide up animation
export const slideUp = (
  element: gsap.DOMTarget,
  duration: number = 1,
  delay: number = 0,
  distance: number = 100
) => {
  return gsap.from(element, {
    opacity: 0,
    y: distance,
    duration,
    delay,
    ease: EASINGS.power3,
  });
};

// Create stagger animation
export const staggerAnimation = (
  elements: gsap.DOMTarget,
  animationType: AnimationType = 'fade',
  options: {
    stagger?: number;
    duration?: number;
    delay?: number;
    ease?: string;
  } = {}
) => {
  const { stagger = 0.1, duration = 0.8, delay = 0, ease = EASINGS.power3 } = options;

  return gsap.from(elements, {
    ...getAnimationProps(animationType),
    stagger,
    duration,
    delay,
    ease,
  });
};

// Create scroll-triggered animation
export const scrollTriggerAnimation = (
  element: gsap.DOMTarget,
  animationType: AnimationType = 'fade',
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
    duration?: number;
    onEnter?: () => void;
    onLeave?: () => void;
  } = {}
) => {
  const {
    start = 'top bottom-=100',
    end = 'top center',
    scrub = false,
    markers = false,
    duration = 1,
    onEnter,
    onLeave,
  } = options;

  return gsap.from(element, {
    ...getAnimationProps(animationType),
    duration,
    ease: EASINGS.power3,
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub,
      markers,
      toggleActions: 'play none none reverse',
      ...(onEnter && { onEnter }),
      ...(onLeave && { onLeave }),
    },
  });
};


// Create timeline animation
export const createTimeline = (options: gsap.TimelineVars = {}) => {
  return gsap.timeline({
    defaults: { ease: EASINGS.power3 },
    ...options,
  });
};

// Text reveal animation (character by character)
export const textReveal = (
  element: HTMLElement,
  options: {
    splitBy?: 'chars' | 'words' | 'lines';
    stagger?: number;
    duration?: number;
  } = {}
) => {
  const { splitBy = 'chars', stagger = 0.03, duration = 0.8 } = options;

  const text = element.textContent || '';
  let splitText: string[] = [];

  switch (splitBy) {
    case 'chars':
      splitText = text.split('');
      break;
    case 'words':
      splitText = text.split(' ');
      break;
    case 'lines':
      splitText = text.split('\n');
      break;
  }

  element.innerHTML = splitText
    .map((unit) => `<span class="inline-block overflow-hidden"><span class="inline-block">${unit === ' ' ? '&nbsp;' : unit}</span></span>`)
    .join(splitBy === 'words' ? ' ' : '');

  const spans = element.querySelectorAll('span span');

  return gsap.from(spans, {
    yPercent: 100,
    opacity: 0,
    stagger,
    duration,
    ease: EASINGS.power3,
  });
};

// Parallax effect
export const parallax = (
  element: gsap.DOMTarget,
  speed: number = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical'
) => {
  const property = direction === 'vertical' ? 'y' : 'x';

  return gsap.to(element, {
    [property]: `${speed * 100}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Kill all ScrollTriggers and animations
export const killAllAnimations = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf('*');
};

// Refresh ScrollTrigger (useful after content changes)
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

// Create entrance animation for page load
export const pageLoadAnimation = (elements: string[]) => {
  const tl = createTimeline({ delay: 0.3 });

  elements.forEach((selector, index) => {
    tl.from(
      selector,
      {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: EASINGS.back,
      },
      index * 0.1
    );
  });

  return tl;
};

export default {
  fadeIn,
  slideUp,
  staggerAnimation,
  scrollTriggerAnimation,
  createTimeline,
  textReveal,
  parallax,
  killAllAnimations,
  refreshScrollTrigger,
  pageLoadAnimation,
  EASINGS,
};
