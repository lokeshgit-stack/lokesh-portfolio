import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TextReveal } from '@/components/animations/TextReveal';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { canHandleHeavyAnimations } from '@/utils/performance';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/utils/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Animated Avatar Component
function AnimatedAvatar() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (sphereRef.current) {
      gsap.to(sphereRef.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });
    }
  }, []);

  return (
    <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        color="#64FFDA"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const enableHeavyAnimations = canHandleHeavyAnimations();

  // Animate section entrance
  useScrollAnimation({
    trigger: sectionRef,
    animation: 'fade',
    start: 'top center+=100',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slide in animation from the side
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center+=100',
          end: 'center center',
          toggleActions: 'play none none reverse',
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Avatar slide from opposite side
      gsap.from(avatarRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center+=100',
          end: 'center center',
          toggleActions: 'play none none reverse',
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Text reveal line by line
      const textLines = contentRef.current?.querySelectorAll('.reveal-text');
      if (textLines) {
        gsap.from(textLines, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top center',
          },
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen py-20 px-4 bg-primary relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <TextReveal
          splitBy="word"
          trigger="scroll"
          className="text-5xl md:text-6xl font-bold text-center text-text-primary mb-16"
        >
          About <span className="text-accent">Me</span>
        </TextReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 3D Avatar Section */}
          <div
            ref={avatarRef}
            className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden 
                     border-2 border-accent/20 hover:border-accent/50 transition-all 
                     duration-500 bg-primary-light shadow-2xl"
          >
            {enableHeavyAnimations ? (
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <AnimatedAvatar />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={2}
                />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-8xl animate-bounce">👨‍💻</div>
              </div>
            )}

            {/* Decorative Elements */}
            <div
              className="absolute top-4 left-4 px-4 py-2 bg-accent/10 backdrop-blur-sm 
                          rounded-lg border border-accent/30"
            >
              <span className="text-accent font-mono text-sm font-semibold">
                {PERSONAL_INFO.title}
              </span>
            </div>

            {/* Live Status Indicator */}
            <div
              className="absolute bottom-4 right-4 px-4 py-2 bg-primary/80 backdrop-blur-sm 
                          rounded-lg border border-accent/30 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-accent font-mono text-xs">Available for Work</span>
            </div>
          </div>

          {/* Content Section */}
          <div ref={contentRef} className="space-y-6">
            <div className="reveal-text">
              <h3 className="text-3xl font-bold text-text-primary mb-4">
                Hello! I'm <span className="text-accent">{PERSONAL_INFO.name}</span>
              </h3>
            </div>

            <p className="reveal-text text-lg text-text-secondary leading-relaxed">
              I'm a passionate Computer Science Engineering student at Mahaveer Institute
              of Technology & Science, specializing in building exceptional digital
              experiences with modern web technologies.
            </p>

            <p className="reveal-text text-lg text-text-secondary leading-relaxed">
              My journey in web development started with a curiosity for creating
              interactive user interfaces. Today, I focus on developing secure, responsive,
              and performant applications using React.js, Node.js, and modern JavaScript
              frameworks.
            </p>

            <p className="reveal-text text-lg text-text-secondary leading-relaxed">
              I have hands-on experience building full-stack applications including secure
              file-sharing platforms, real-time chat systems, and authentication solutions.
              I'm also passionate about cybersecurity, having completed 25+ labs on
              TryHackMe.
            </p>

            {/* Contact Details Card */}
            {/* <Card variant="glass" className="reveal-text mt-8">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span>📞</span>
                  Let's Connect
                </h4>
                <div className="space-y-3">
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="flex items-center gap-3 text-text-secondary hover:text-accent 
                             transition-all duration-300 group p-2 rounded-lg hover:bg-accent/10"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      📧
                    </span>
                    <span className="font-mono text-sm break-all">{PERSONAL_INFO.email}</span>
                  </a>

                  <a
                    href={`tel:${PERSONAL_INFO.phone}`}
                    className="flex items-center gap-3 text-text-secondary hover:text-accent 
                             transition-all duration-300 group p-2 rounded-lg hover:bg-accent/10"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      📱
                    </span>
                    <span className="font-mono text-sm">{PERSONAL_INFO.phone}</span>
                  </a>

                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-secondary hover:text-accent 
                             transition-all duration-300 group p-2 rounded-lg hover:bg-accent/10"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      💼
                    </span>
                    <span className="font-mono text-sm">linkedin.com/in/lokesh-trivedi</span>
                  </a>

                  <div
                    className="flex items-center gap-3 text-text-secondary p-2 rounded-lg"
                  >
                    <span className="text-2xl">📍</span>
                    <span className="font-mono text-sm">{PERSONAL_INFO.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Action Buttons */}
            <div className="reveal-text pt-6 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                icon="📥"
                iconPosition="right"
                onClick={() => window.open(PERSONAL_INFO.resume, '_blank')}
              >
                Download Resume
              </Button>

              <Button
                variant="outline"
                size="lg"
                icon="💬"
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Contact Me
              </Button>
            </div>

            {/* Tech Stack Badges */}
            <div className="reveal-text pt-6">
              <p className="text-sm text-text-secondary mb-3">Technologies I work with:</p>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Three.js'].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary-light border border-accent/30 
                               rounded-full text-xs font-mono text-accent 
                               hover:bg-accent/10 hover:border-accent transition-all"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { label: 'Projects', value: '10+', icon: '🚀' },
            { label: 'Technologies', value: '15+', icon: '⚡' },
            { label: 'Code Lines', value: '10K+', icon: '💻' },
            { label: 'Labs Completed', value: '25+', icon: '🛡️' },
          ].map((stat, index) => (
            <Card
              key={index}
              variant="glass"
              hoverable
              className="text-center transform transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
