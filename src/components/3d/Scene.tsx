import { Suspense, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment,
  ContactShadows,
  useProgress,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  enableOrbitControls?: boolean;
  enableShadows?: boolean;
  background?: string | THREE.Color;
  environmentPreset?: 
    | 'sunset' 
    | 'dawn' 
    | 'night' 
    | 'warehouse' 
    | 'forest' 
    | 'apartment' 
    | 'studio' 
    | 'city' 
    | 'park' 
    | 'lobby';
  className?: string;
  lightingPreset?: 'default' | 'soft' | 'dramatic' | 'minimal';
  enablePerformanceMonitor?: boolean;
}

// Loading fallback component
function Loader() {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div className="text-accent font-mono text-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="w-32 h-1 bg-primary-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </Html>
  );
}

// Lighting configurations
function SceneLighting({ preset = 'default' }: { preset: string }) {
  switch (preset) {
    case 'soft':
      return (
        <>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.4} castShadow />
          <pointLight position={[-5, 3, -5]} intensity={0.3} color="#64FFDA" />
        </>
      );

    case 'dramatic':
      return (
        <>
          <ambientLight intensity={0.2} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64FFDA" />
        </>
      );

    case 'minimal':
      return (
        <>
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 5, 5]} intensity={0.3} />
        </>
      );

    case 'default':
    default:
      return (
        <>
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1} 
            castShadow 
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64FFDA" />
          <directionalLight position={[0, 5, 5]} intensity={0.3} />
        </>
      );
  }
}

export const Scene = ({
  children,
  cameraPosition = [0, 0, 5],
  cameraFov = 50,
  enableOrbitControls = true,
  enableShadows = true,
  background,
  environmentPreset = 'city',
  className = 'w-full h-full',
  lightingPreset = 'default',
  enablePerformanceMonitor = false,
}: SceneProps) => {
  return (
    <div className={className}>
      <Canvas
        shadows={enableShadows}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 2]} // Device pixel ratio for better quality
        performance={{ min: 0.5 }} // Performance monitoring
      >
        {/* Camera Setup */}
        <PerspectiveCamera 
          makeDefault 
          position={cameraPosition} 
          fov={cameraFov} 
        />

        {/* Lighting */}
        <SceneLighting preset={lightingPreset} />

        {/* Environment Map for Reflections */}
        <Environment 
          preset={environmentPreset}
          background={false}
        />

        {/* Background Color/Gradient */}
        {background && <color attach="background" args={[background]} />}

        {/* Suspense for loading 3D assets */}
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>

        {/* Contact Shadows (ground plane) */}
        {enableShadows && (
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        )}

        {/* Orbit Controls */}
        {enableOrbitControls && (
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={2}
            maxDistance={10}
            makeDefault
          />
        )}

        {/* Performance Monitor (dev only) */}
        {enablePerformanceMonitor  && (
          <Html position={[-2, 2, 0]}>
            <div className="bg-primary/80 p-2 rounded text-accent text-xs font-mono">
              Performance Monitor Active
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
};

// Preset Scene Configurations
export const HeroScene = ({ children }: { children: ReactNode }) => (
  <Scene
    cameraPosition={[0, 1, 5]}
    cameraFov={50}
    enableOrbitControls={true}
    enableShadows={true}
    lightingPreset="default"
    environmentPreset="city"
    className="w-full h-full"
  >
    {children}
  </Scene>
);

export const AboutScene = ({ children }: { children: ReactNode }) => (
  <Scene
    cameraPosition={[0, 0, 5]}
    cameraFov={45}
    enableOrbitControls={true}
    enableShadows={false}
    lightingPreset="soft"
    environmentPreset="apartment"
    className="w-full h-full"
  >
    {children}
  </Scene>
);

export const MinimalScene = ({ children }: { children: ReactNode }) => (
  <Scene
    cameraPosition={[0, 0, 3]}
    cameraFov={75}
    enableOrbitControls={false}
    enableShadows={false}
    lightingPreset="minimal"
    environmentPreset="studio"
    className="w-full h-full"
  >
    {children}
  </Scene>
);

export default Scene;
