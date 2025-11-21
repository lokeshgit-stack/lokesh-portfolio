import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { AnimatedBackground } from '@/components/3d/AnimatedBackground';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { canHandleHeavyAnimations } from '@/utils/performance';
import { SpeedInsights } from "@vercel/speed-insights/next"
import './styles/globals.css';

function App() {
  const enableHeavyAnimations = canHandleHeavyAnimations();

  useEffect(() => {
    // Prevent default scroll behavior during load for smoother animations
    document.documentElement.style.scrollBehavior = 'auto';

    // Add smooth scroll after initial load
    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="relative bg-primary text-text-primary overflow-x-hidden">
      {/* <SpeedInsights/> */}
      {/* Navigation */}
      <Navbar />

      {/* Scroll Progress Indicators */}
      <ScrollProgress />

      {/* Animated 3D Background (Performance-aware) */}
      {enableHeavyAnimations && <AnimatedBackground />}

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
