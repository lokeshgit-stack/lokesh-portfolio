import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei';
import { useHeroAnimations } from '@/components/animations/HeroAnimations';
import { TextReveal, GlitchText } from '@/components/animations/TextReveal';
import { Button } from '@/components/ui/Button';
import { LaptopModel } from '@/components/3d/LaptopModel';
import { ParticleField } from '@/components/3d/ParticleField';
import { canHandleHeavyAnimations } from '@/utils/performance';
import { PERSONAL_INFO } from '@/utils/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [enableHeavyAnimations] = useState(canHandleHeavyAnimations());

  // Hero entrance animations
  useHeroAnimations({
    titleRef,
    subtitleRef,
    descriptionRef,
    buttonRef: buttonRef as any,
    onComplete: () => console.log('Hero animations complete!'),
  });

  // Parallax scroll effect
  useEffect(() => {
    if (!heroRef.current || !canvasRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect on 3D scene
      gsap.to(canvasRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 200,
        opacity: 0.3,
      });

      // Parallax effect on content
      gsap.to('.hero-content', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 150,
        opacity: 0,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary"
    >
      {/* Animated Background Particles */}
      {enableHeavyAnimations && (
        <div className="absolute inset-0 -z-10 opacity-20">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ParticleField
              count={2000}
              size={0.02}
              color="#64FFDA"
              radius={15}
              variant="stars"
              enableMouseInteraction={true}
            />
          </Canvas>
        </div>
      )}

      {/* 3D Laptop Scene */}
      <div
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none md:pointer-events-auto"
      >
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
          
          {/* Lighting Setup */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64FFDA" />
          <directionalLight position={[0, 5, 5]} intensity={0.3} />

          {/* 3D Laptop Model */}
          <LaptopModel
            scale={1.3}
            position={[0, 0, 0]}
            enableAutoRotate={true}
          />

          {/* Environment for reflections */}
          {enableHeavyAnimations && <Environment preset="city" />}

          {/* Camera Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary z-0" />

      {/* Hero Content */}
      <div className="hero-content relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Main Title with Character Animation */}
        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-text-primary mb-6 
                   tracking-tight leading-none"
        >
          <span className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">
            LOKESH TRIVEDI
          </span>
        </h1>

        {/* Subtitle with Glitch Effect */}
        <div ref={subtitleRef} className="mb-6">
          <GlitchText className="text-xl sm:text-2xl md:text-3xl text-accent font-mono font-semibold">
            {PERSONAL_INFO.subtitle}
          </GlitchText>
        </div>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto 
                   mb-10 leading-relaxed px-4"
        >
          Passionate Computer Science Engineering student with strong skills in frontend
          development using <span className="text-accent font-semibold">React.js</span> and
          modern web technologies. Experienced in building secure, responsive, and interactive
          applications with practical project experience.
        </p>

        {/* Call-to-Action Buttons */}
        <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            size="lg"
            icon="🚀"
            iconPosition="right"
            onClick={() => scrollToSection('projects')}
            className="min-w-[200px]"
          >
            View Projects
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon="💼"
            iconPosition="left"
            onClick={() => scrollToSection('contact')}
            className="min-w-[200px]"
          >
            Get in Touch
          </Button>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex gap-6 justify-center items-center">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-light 
                     text-text-secondary hover:text-accent hover:bg-accent/10 transition-all 
                     duration-300 transform hover:scale-110 border border-accent/20 
                     hover:border-accent"
            aria-label="GitHub"
          >
            <span className="text-2xl">🐙</span>
          </a>
          
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-light 
                     text-text-secondary hover:text-accent hover:bg-accent/10 transition-all 
                     duration-300 transform hover:scale-110 border border-accent/20 
                     hover:border-accent"
            aria-label="LinkedIn"
          >
            <span className="text-2xl">💼</span>
          </a>
          
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-light 
                     text-text-secondary hover:text-accent hover:bg-accent/10 transition-all 
                     duration-300 transform hover:scale-110 border border-accent/20 
                     hover:border-accent"
            aria-label="Email"
          >
            <span className="text-2xl">📧</span>
          </a>
          
          <a
            href={PERSONAL_INFO.resume}
            download
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-light 
                     text-text-secondary hover:text-accent hover:bg-accent/10 transition-all 
                     duration-300 transform hover:scale-110 border border-accent/20 
                     hover:border-accent"
            aria-label="Resume"
          >
            <span className="text-2xl">📄</span>
          </a>
        </div>

        {/* Tech Stack Badges */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center items-center max-w-2xl mx-auto">
          {['React.js', 'TypeScript', 'Three.js', 'Node.js', 'MongoDB', 'Tailwind CSS'].map(
            (tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-primary-light border border-accent/30 rounded-full 
                         text-sm font-mono text-accent hover:bg-accent/10 hover:border-accent 
                         transition-all duration-300 transform hover:scale-105"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-text-secondary font-mono">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center p-1">
            <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-accent/20 rounded-full 
                    animate-pulse hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-accent/20 
                    rotate-45 animate-pulse hidden lg:block" />
    </section>
  );
};

export default Hero;
