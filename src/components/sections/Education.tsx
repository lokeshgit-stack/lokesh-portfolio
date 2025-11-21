import { useRef, useEffect } from 'react';
import { useScrollAnimation, useParallaxScroll } from '@/hooks/useScrollAnimation';
import { TextReveal } from '@/components/animations/TextReveal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EDUCATION } from '@/utils/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  duration: string;
  description: string;
  icon?: string;
  color?: string;
}

// Extended education data with visual properties
const educationData: EducationItem[] = EDUCATION.map((item, index) => ({
  ...item,
  icon: ['🎓', '📚', '📖'][index] || '🎓',
  color: [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500',
  ][index] || 'from-blue-500 to-cyan-500',
}));

export const Education = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const achievementsRef = useRef<HTMLDivElement>(null);

  // Animate section entrance
  useScrollAnimation({
    trigger: sectionRef,
    animation: 'fade',
    start: 'top center+=100',
  });

  // Parallax effect on timeline
  useParallaxScroll(timelineRef, 0.2);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate timeline line building progressively
      const timelineLine = timelineRef.current?.querySelector('.timeline-line');
      if (timelineLine) {
        gsap.from(timelineLine, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
          scaleY: 0,
          transformOrigin: 'top center',
          ease: 'none',
        });
      }

      // Animate each education card
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Card entrance animation
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Timeline node animation
        const node = card.querySelector('.timeline-node');
        if (node) {
          gsap.from(node, {
            scrollTrigger: {
              trigger: card,
              start: 'top center+=100',
            },
            scale: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
          });

          // Continuous glow pulse
          gsap.to(node, {
            boxShadow: '0 0 30px rgba(100, 255, 218, 0.8)',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      });

      // Animate achievements
      if (achievementsRef.current) {
        gsap.from(achievementsRef.current, {
          scrollTrigger: {
            trigger: achievementsRef.current,
            start: 'top bottom-=50',
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="min-h-screen py-20 px-4 bg-primary-light relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <TextReveal
            splitBy="word"
            trigger="scroll"
            className="text-5xl md:text-6xl font-bold text-text-primary mb-6"
          >
            Educational <span className="text-accent">Journey</span>
          </TextReveal>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            A timeline of my academic achievements and continuous learning path towards
            becoming a skilled software engineer
          </p>
        </div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 hidden md:block">
            <div className="timeline-line w-full h-full bg-gradient-to-b from-accent via-accent to-accent/30 rounded-full" />
          </div>

          {/* Education Cards */}
          <div className="space-y-12 md:space-y-16">
            {educationData.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Node (Glowing Circle) */}
                <div
                  className="timeline-node absolute left-1/2 -translate-x-1/2 w-6 h-6 
                           bg-accent rounded-full border-4 border-primary-light z-10 
                           hidden md:block cursor-pointer"
                />

                {/* Spacer for alignment */}
                <div className="hidden md:block flex-1" />

                {/* Card */}
                <div className="flex-1">
                  <Card
                    variant="elevated"
                    hoverable
                    className="transform transition-all duration-500"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        {/* Icon */}
                        <div
                          className={`text-5xl w-16 h-16 flex items-center justify-center 
                                   rounded-xl bg-gradient-to-br ${item.color} shadow-lg
                                   transform hover:scale-110 transition-transform`}
                        >
                          {item.icon}
                        </div>

                        {/* Duration Badge */}
                        <span
                          className="text-sm text-accent font-mono bg-accent/10 px-4 py-2 
                                   rounded-full border border-accent/30"
                        >
                          {item.duration}
                        </span>
                      </div>

                      <CardTitle className="text-2xl group-hover:text-accent transition-colors">
                        {item.degree}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      {/* Institution */}
                      <p className="text-lg text-accent font-semibold mb-4 flex items-center gap-2">
                        <span>🏫</span>
                        {item.institution}
                      </p>

                      {/* Description */}
                      <p className="text-text-secondary leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Decorative Line */}
                      <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent rounded" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

            {/* Visual Separator - ADD THIS */}
      <div className="max-w-5xl mx-auto relative z-10 my-24">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <span className="text-accent/50 text-sm font-mono">◆</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>
      </div>

        {/* Additional Achievements Section */}
        <div ref={achievementsRef} className="mt-32 md:mt-40">
          <Card variant="glass" className="text-center">
            <div className="p-8">
              <h3 className="text-3xl font-bold text-text-primary mb-6 flex items-center justify-center gap-3">
                <span className="text-4xl">🏆</span>
                Additional Achievements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    icon: '🛡️',
                    title: '25+ Labs',
                    description: 'TryHackMe Completed',
                    color: 'from-purple-500 to-pink-500',
                  },
                  {
                    icon: '💻',
                    title: '10+ Projects',
                    description: 'Full-Stack Development',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    icon: '🔐',
                    title: 'Security',
                    description: 'Cybersecurity Enthusiast',
                    color: 'from-green-500 to-teal-500',
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-primary p-6 rounded-xl border border-accent/20 
                             hover:border-accent/50 transition-all duration-300 
                             transform hover:scale-105"
                  >
                    <div
                      className={`text-4xl w-16 h-16 flex items-center justify-center 
                               rounded-full bg-gradient-to-br ${achievement.color} mx-auto mb-3 shadow-lg`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="text-2xl font-bold text-accent mb-1">
                      {achievement.title}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {achievement.description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  'Data Structures & Algorithms',
                  'Web Development',
                  'Database Management',
                  'Network Security',
                  'Software Engineering',
                  'Problem Solving',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-primary-light rounded-full text-accent 
                             border border-accent/30 hover:border-accent hover:bg-accent/10 
                             transition-all text-sm font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        {/* <div className="mt-16 text-center">
          <p className="text-lg text-text-secondary mb-6">
            Continuously learning and growing in the field of technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              icon="📄"
              onClick={() => window.open('/resume.pdf', '_blank')}
            >
              Download Resume
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon="💼"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Get in Touch
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Education;
