import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollAnimationOptions {
  trigger?: RefObject<HTMLElement> | string;
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  duration?: number;
  delay?: number;
  stagger?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions) => {
  const {
    trigger,
    animation = 'fade',
    start = 'top bottom-=100',
    end = 'top center',
    scrub = false,
    pin = false,
    markers = false,
    duration = 1,
    delay = 0,
    stagger = 0,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options;

  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = trigger
      ? typeof trigger === 'string'
        ? document.querySelector(trigger)
        : trigger.current
      : elementRef.current;

    if (!element) return;

    const getAnimationProps = () => {
      switch (animation) {
        case 'fade':
          return { opacity: 0 };
        case 'slideUp':
          return { opacity: 0, y: 100 };
        case 'slideDown':
          return { opacity: 0, y: -100 };
        case 'slideLeft':
          return { opacity: 0, x: 100 };
        case 'slideRight':
          return { opacity: 0, x: -100 };
        case 'scale':
          return { opacity: 0, scale: 0.5 };
        case 'rotate':
          return { opacity: 0, rotation: 45 };
        default:
          return { opacity: 0 };
      }
    };

    const ctx = gsap.context(() => {
      gsap.from(element, {
        ...getAnimationProps(),
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          pin,
          markers,
          toggleActions: 'play none none reverse',
          onEnter: () => onEnter?.(),
          onLeave: () => onLeave?.(),
          onEnterBack: () => onEnterBack?.(),
          onLeaveBack: () => onLeaveBack?.(),
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [trigger, animation, start, end, scrub, pin, markers, duration, delay, stagger, onEnter, onLeave, onEnterBack, onLeaveBack]);

  return elementRef;
};

// Hook for parallax scrolling
export const useParallaxScroll = (
  ref: RefObject<HTMLElement>,
  speed: number = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical'
) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const property = direction === 'vertical' ? 'y' : 'x';
      
      gsap.to(ref.current, {
        [property]: `${speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [ref, speed, direction]);
};

// Hook for scroll progress
export const useScrollProgress = (
  callback: (progress: number) => void,
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      callback(Math.min(100, Math.max(0, progress)));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [callback, ...deps]);
};

// Hook for reveal on scroll with intersection observer
export const useRevealOnScroll = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const { threshold = 0.1, rootMargin = '0px' } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const observer = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    
    if (!entry) return;
    
    if (entry.isIntersecting) {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          });
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    // Set initial state
    gsap.set(element, { opacity: 0, y: 50 });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin]);
};

// Hook for batch scroll animations
export const useBatchScrollAnimation = (
  selector: string,
  animation: 'fade' | 'slideUp' | 'scale' = 'fade',
  options: {
    stagger?: number;
    start?: string;
    duration?: number;
  } = {}
) => {
  const { stagger = 0.15, start = 'top bottom-=100', duration = 1 } = options;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const getAnimationProps = () => {
        switch (animation) {
          case 'fade':
            return { opacity: 0 };
          case 'slideUp':
            return { opacity: 0, y: 100 };
          case 'scale':
            return { opacity: 0, scale: 0.5 };
          default:
            return { opacity: 0 };
        }
      };

      ScrollTrigger.batch(selector, {
        onEnter: (batch) => {
          gsap.from(batch, {
            ...getAnimationProps(),
            stagger,
            duration,
            ease: 'power3.out',
          });
        },
        start,
      });
    });

    return () => {
      ctx.revert();
    };
  }, [selector, animation, stagger, start, duration]);
};

export default useScrollAnimation;
