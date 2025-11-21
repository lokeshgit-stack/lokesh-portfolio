import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei';
import { useHeroAnimations } from '@/components/animations/HeroAnimations';
import { GlitchText } from '@/components/animations/TextReveal'; // Removed unused TextReveal import
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
  const subtitleRef = useRef<HTMLDivElement>(null); // Changed to Div to match usage
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // State for performance detection
  const [enableHeavyAnimations] = useState(() => canHandleHeavyAnimations());

  // Hero entrance animations hook
  useHeroAnimations({
    titleRef,
    subtitleRef: subtitleRef as any, // Cast if type mismatch exists in hook definition
    descriptionRef,
    buttonRef: buttonRef as any,
    onComplete: () => console.log('Hero animations complete!'),
  });

  // Parallax and Scroll Effects
  useEffect(() => {
    if (!heroRef.current || !canvasRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax for 3D Background
      gsap.to(canvasRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5, // Smoother scrub
        },
        y: 100, // Reduced movement for better stability
        opacity: 0,
      });

      // Parallax for Content (Foreground)
      gsap.to('.hero-content', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 20%',
          scrub: 0.5,
        },
        y: -50, // Move up slightly
        opacity: 0,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-primary pt-20 md:pt-0"
    >
      {/* --- LAYER 1: 3D Background (Particles) --- */}
      {enableHeavyAnimations && (
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
            <ParticleField
              count={1500} // Reduced count for better performance
              size={0.02}
              color="#64FFDA"
              radius={15}
              variant="stars"
              enableMouseInteraction={true}
            />
          </Canvas>
        </div>
      )}

      {/* --- LAYER 2: Main 3D Scene (Laptop) --- */}
      <div
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none md:pointer-events-auto"
      >
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={45} />
          
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1.2}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64FFDA" />
          
          {/* Model */}
          <LaptopModel
            scale={1.2}
            position={[0, -0.5, 0]} // Lowered slightly to not block text
            enableAutoRotate={true}
          />

          {/* Environment */}
          {enableHeavyAnimations && <Environment preset="city" />}

          {/* Controls (Limited interaction) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2}
            enableRotate={true}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* --- LAYER 3: Gradient Overlay --- */}
      {/* Improves text readability over the 3D model */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/70 to-primary z-0 pointer-events-none" />

      {/* --- LAYER 4: Content --- */}
      <div className="hero-content relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Name Title */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-text-primary mb-4 mt-20 
                   tracking-tight leading-tight drop-shadow-2xl"
        >
          <span className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">
            LOKESH TRIVEDI
          </span>
        </h1>

        {/* Glitch Subtitle */}
        <div ref={subtitleRef} className="mb-8 h-8 sm:h-10">
          <GlitchText className="text-lg sm:text-2xl md:text-3xl text-accent font-mono font-bold tracking-wider">
            {PERSONAL_INFO.subtitle}
          </GlitchText>
        </div>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto 
                   mb-10 leading-relaxed px-4 md:px-0 drop-shadow-md"
        >
          Passionate Computer Science Engineering student with strong skills in frontend
          development using <span className="text-accent font-semibold">React.js</span> and
          modern web technologies. Experienced in building secure, responsive, and interactive
          applications.
        </p>

        {/* Action Buttons */}
        <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center z-20">
          <Button
            variant="primary"
            size="lg"
            icon="🚀"
            iconPosition="right"
            onClick={() => scrollToSection('projects')}
            className="w-full sm:w-48 shadow-lg shadow-accent/20"
          >
            View Projects
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon="💼"
            iconPosition="left"
            onClick={() => scrollToSection('contact')}
            className="w-full sm:w-48 backdrop-blur-sm bg-primary/30"
          >
            Get in Touch
          </Button>
        </div>

        {/* Social Links Row */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center items-center animate-fade-in-up delay-300">
          {[
            { href: PERSONAL_INFO.github, icon: "🐙", label: "GitHub" },
            { href: PERSONAL_INFO.linkedin, icon: "💼", label: "LinkedIn" },
            { href: `mailto:${PERSONAL_INFO.email}`, icon: "📧", label: "Email" },
            { href: PERSONAL_INFO.resume, icon: "📄", label: "Resume", download: true }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target={item.download ? "_self" : "_blank"}
              rel={item.download ? "" : "noopener noreferrer"}
              download={item.download}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-light/80 
                       backdrop-blur-md border border-accent/20 text-text-secondary hover:text-accent 
                       hover:bg-accent/10 hover:border-accent transition-all duration-300 
                       transform hover:scale-110 hover:-translate-y-1 shadow-lg"
              aria-label={item.label}
            >
              <span className="text-2xl">{item.icon}</span>
            </a>
          ))}
        </div>

        {/* Tech Stack Badges (Desktop Only) */}
        <div className="hidden md:flex mt-10 flex-wrap gap-3 justify-center items-center max-w-3xl opacity-70 hover:opacity-100 transition-opacity duration-300">
          {['React.js', 'TypeScript', 'Three.js', 'Node.js', 'MongoDB', 'Tailwind CSS'].map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-primary-dark/50 border border-accent/10 rounded-full 
                         text-xs font-mono text-accent hover:bg-accent/5 hover:border-accent/30 
                         transition-colors cursor-default"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
           onClick={() => scrollToSection('about')}>
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-text-secondary">Scroll</span>
          <div className="w-5 h-9 border-2 border-accent/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-accent rounded-full animate-scroll-down" />
          </div>
        </div>
      </div>

      {/* Background Decoration Blobs (CSS-only fallback) */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default Hero;
