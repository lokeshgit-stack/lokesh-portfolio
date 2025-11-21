import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationProps {
  trigger: RefObject<HTMLElement>;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'rotate';
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

export const useScrollAnimation = ({
  trigger,
  animation = 'fade-up',
  start = 'top bottom-=100',
  end = 'top center',
  scrub = false,
  markers = false,
  onEnter,
  onLeave,
}: ScrollAnimationProps) => {
  useEffect(() => {
    if (!trigger.current) return;

    const element = trigger.current;
    let animationProps = {};

    switch (animation) {
      case 'fade-up':
        animationProps = {
          opacity: 0,
          y: 100,
        };
        break;

      case 'fade-in':
        animationProps = {
          opacity: 0,
        };
        break;

      case 'slide-left':
        animationProps = {
          opacity: 0,
          x: 100,
        };
        break;

      case 'slide-right':
        animationProps = {
          opacity: 0,
          x: -100,
        };
        break;

      case 'scale':
        animationProps = {
          opacity: 0,
          scale: 0.5,
        };
        break;

      case 'rotate':
        animationProps = {
          opacity: 0,
          rotation: 45,
        };
        break;
    }

    const ctx = gsap.context(() => {
      gsap.from(element, {
        ...animationProps,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          markers,
          toggleActions: 'play none none reverse',
          onEnter: () => onEnter?.(),
          onLeave: () => onLeave?.(),
        },
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [trigger, animation, start, end, scrub, markers, onEnter, onLeave]);
};

// Batch scroll animations for multiple elements
export const useScrollBatch = (selector: string, animation: string = 'fade-up') => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(selector, {
        onEnter: (batch: gsap.DOMTarget[]) => {
          gsap.from(batch, {
            opacity: 0,
            y: animation === 'fade-up' ? 100 : 0,
            x: animation === 'slide-left' ? 100 : animation === 'slide-right' ? -100 : 0,
            scale: animation === 'scale' ? 0.5 : 1,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
          });
        },
        start: 'top bottom-=100',
      });
    });

    return () => {
      ctx.revert();
    };
  }, [selector, animation]);
};

// Parallax scroll effect
export const useParallax = (ref: RefObject<HTMLElement>, speed: number = 0.5) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: `${speed * 100}%`,
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
  }, [ref, speed]);
};

// Pin section on scroll
export const usePinSection = (ref: RefObject<HTMLElement>, duration: string = '100%') => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: `+=${duration}`,
        pin: true,
        pinSpacing: true,
      });
    });

    return () => {
      ctx.revert();
    };
  }, [ref, duration]);
};

// Reveal elements on scroll (batch)
interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
}

export const RevealOnScroll = ({ children, className = '' }: RevealOnScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('[data-reveal]');

    const ctx = gsap.context(() => {
      elements.forEach((element: Element) => {
        gsap.from(element as HTMLElement, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element as HTMLElement,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
        });
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default useScrollAnimation;
