import { Canvas } from '@react-three/fiber';
import { ParticleField } from '@/components/3d/ParticleField';
import { usePerformanceDetect } from '@/hooks/usePerformanceDetect';
import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const { enableHeavyAnimations } = usePerformanceDetect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or if animations are disabled for performance
  if (!mounted || !enableHeavyAnimations) {
    return null; 
  }

  return (
    <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]} // Optimize pixel ratio for performance
        gl={{ 
          antialias: false, // Disable antialias for background to save resources
          powerPreference: 'high-performance' 
        }}
      >
        <ambientLight intensity={0.5} />
        
        {/* Main star field */}
        <ParticleField
          count={3000}
          size={0.02}
          color="#64FFDA"
          opacity={0.6}
          radius={15}
          variant="stars"
          enableMouseInteraction={true}
          speed={0.5}
        />

        {/* Subtle floating particles for depth */}
        <ParticleField
          count={500}
          size={0.04}
          color="#61DAFB"
          opacity={0.3}
          radius={20}
          variant="float"
          enableMouseInteraction={false}
          speed={0.2}
        />
      </Canvas>
      
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary" />
    </div>
  );
};

export default AnimatedBackground;
