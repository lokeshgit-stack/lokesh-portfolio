import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: ReactNode;
  trigger?: 'scroll' | 'immediate';
  staggerDelay?: number;
  duration?: number;
  className?: string;
  splitBy?: 'char' | 'word' | 'line';
}

export const TextReveal = ({
  children,
  trigger = 'scroll',
  staggerDelay = 0.03,
  duration = 0.8,
  className = '',
  splitBy = 'char',
}: TextRevealProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current.textContent || '';
    let splitText: string[] = [];

    // Split text based on splitBy prop
    switch (splitBy) {
      case 'char':
        splitText = text.split('');
        break;
      case 'word':
        splitText = text.split(' ');
        break;
      case 'line':
        splitText = text.split('\n');
        break;
    }

    // Wrap each unit in a span
    textRef.current.innerHTML = splitText
      .map((unit) => {
        const content = unit === ' ' ? '&nbsp;' : unit === '\n' ? '<br/>' : unit;
        return `<span class="inline-block overflow-hidden"><span class="inline-block">${content}</span></span>`;
      })
      .join(splitBy === 'word' ? ' ' : '');

    const spans = textRef.current.querySelectorAll('span span');

    const ctx = gsap.context(() => {
      if (trigger === 'immediate') {
        // Animate immediately on mount
        gsap.from(spans, {
          yPercent: 100,
          opacity: 0,
          stagger: staggerDelay,
          duration,
          ease: 'power3.out',
        });
      } else {
        // Animate on scroll
        gsap.from(spans, {
          yPercent: 100,
          opacity: 0,
          stagger: staggerDelay,
          duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
        });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [children, trigger, staggerDelay, duration, splitBy]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
};

// Typing animation effect
export const TypingText = ({
  text,
  speed = 0.05,
  className = '',
}: {
  text: string;
  speed?: number;
  className?: string;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const chars = text.split('');
    textRef.current.textContent = '';

    const ctx = gsap.context(() => {
      chars.forEach((char, index) => {
        gsap.to(textRef.current, {
          duration: 0,
          delay: index * speed,
          onComplete: () => {
            if (textRef.current) {
              textRef.current.textContent += char;
            }
          },
        });
      });
    });

    return () => {
      ctx.revert();
    };
  }, [text, speed]);

  return <span ref={textRef} className={className} />;
};

// Glitch text effect
export const GlitchText = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

      tl.to(textRef.current, {
        skewX: 70,
        duration: 0.1,
        ease: 'power4.inOut',
      })
        .to(textRef.current, {
          skewX: 0,
          duration: 0.1,
        })
        .to(textRef.current, {
          x: -20,
          duration: 0.05,
        })
        .to(textRef.current, {
          x: 0,
          duration: 0.05,
        });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={textRef} className={`${className} relative`}>
      {children}
    </div>
  );
};

// Wave text animation
export const WaveText = ({
  text,
  className = '',
  delay = 0.05,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = text.split('');
    containerRef.current.innerHTML = chars
      .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');

    const spans = containerRef.current.querySelectorAll('span');

    const ctx = gsap.context(() => {
      spans.forEach((span, index) => {
        gsap.to(span, {
          y: -20,
          duration: 0.5,
          delay: index * delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    });

    return () => {
      ctx.revert();
    };
  }, [text, delay]);

  return <div ref={containerRef} className={className} />;
};

export default TextReveal;
