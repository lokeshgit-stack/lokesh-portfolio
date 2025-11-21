import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroAnimationsProps {
  titleRef: React.RefObject<HTMLHeadingElement>;
  subtitleRef?: React.RefObject<HTMLParagraphElement>;
  descriptionRef?: React.RefObject<HTMLParagraphElement>;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  onComplete?: () => void;
}

export const useHeroAnimations = ({
  titleRef,
  subtitleRef,
  descriptionRef,
  buttonRef,
  onComplete,
}: HeroAnimationsProps) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Create master timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => onComplete?.(),
    });

    timelineRef.current = tl;

    // Title animation - split and stagger
    if (titleRef.current) {
      const titleChars = titleRef.current.textContent?.split('') || [];
      titleRef.current.innerHTML = titleChars
        .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');

      tl.from(titleRef.current.children, {
        opacity: 0,
        y: 50,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }

    // Subtitle animation
    if (subtitleRef?.current) {
      tl.from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
        },
        '-=0.4'
      );
    }

    // Description animation
    if (descriptionRef?.current) {
      tl.from(
        descriptionRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
        },
        '-=0.6'
      );
    }

    // Button animation
    if (buttonRef?.current) {
      tl.from(
        buttonRef.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      );

      // Add pulsing glow effect
      gsap.to(buttonRef.current, {
        boxShadow: '0 0 30px rgba(100, 255, 218, 0.6)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [titleRef, subtitleRef, descriptionRef, buttonRef, onComplete]);

  return timelineRef;
};

// Alternative: Pre-built Hero Animation Component
export const HeroAnimation = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('[data-animate]');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    elements.forEach((element, index) => {
      const animationType = element.getAttribute('data-animate');

      switch (animationType) {
        case 'fade-up':
          tl.from(
            element,
            {
              opacity: 0,
              y: 50,
              duration: 0.8,
            },
            index * 0.1
          );
          break;

        case 'fade-in':
          tl.from(
            element,
            {
              opacity: 0,
              duration: 0.8,
            },
            index * 0.1
          );
          break;

        case 'scale':
          tl.from(
            element,
            {
              opacity: 0,
              scale: 0.5,
              duration: 0.8,
              ease: 'back.out(1.7)',
            },
            index * 0.1
          );
          break;

        case 'slide-left':
          tl.from(
            element,
            {
              opacity: 0,
              x: 100,
              duration: 0.8,
            },
            index * 0.1
          );
          break;

        case 'slide-right':
          tl.from(
            element,
            {
              opacity: 0,
              x: -100,
              duration: 0.8,
            },
            index * 0.1
          );
          break;
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default useHeroAnimations;
