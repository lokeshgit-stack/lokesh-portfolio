import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface LaptopModelProps {
  modelPath?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  enableAutoRotate?: boolean;
  morphToIcons?: boolean;
}

export function LaptopModel({
  modelPath = '/models/laptop.glb',
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  enableAutoRotate = true,
  morphToIcons = false,
}: LaptopModelProps) {
  const group = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Try to load GLTF model (will fallback if not found)
  let scene: THREE.Group | undefined;
  try {
    const gltf = useGLTF(modelPath);
    scene = gltf.scene;
  } catch (error) {
    console.warn('GLTF model not found, using fallback geometry');
  }

  // Mouse tracking
  const { mouse } = useThree();

  useEffect(() => {
    if (group.current && morphToIcons) {
      // Morph animation using GSAP
      gsap.to(group.current.rotation, {
        y: Math.PI * 2,
        duration: 3,
        repeat: -1,
        ease: 'none',
      });
    }
  }, [morphToIcons]);

  useFrame((state) => {
    if (!group.current) return;

    // Auto-rotation
    if (enableAutoRotate && !isHovered) {
      group.current.rotation.y += 0.005;
    }

    // Hover effect - tilt based on mouse
    if (isHovered) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        mouse.y * 0.3,
        0.1
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        mouse.x * 0.5 + Math.PI,
        0.1
      );
    }

    // Floating animation
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  if (scene) {
    // Use loaded GLTF model
    return (
      <group
        ref={group}
        position={position}
        rotation={rotation}
        scale={scale}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <primitive object={scene.clone()} />
      </group>
    );
  }

  // Fallback: Geometric laptop
  return (
    <GeometricLaptop
      position={position}
      rotation={rotation}
      scale={scale}
      enableAutoRotate={enableAutoRotate}
    />
  );
}

// Fallback geometric laptop (no external model needed)
export function GeometricLaptop({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  enableAutoRotate = true,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  enableAutoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Auto-rotation
    if (enableAutoRotate && !isHovered) {
      groupRef.current.rotation.y += 0.008;
    }

    // Hover tilt effect
    if (isHovered) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.2,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.x * 0.3 + Math.PI / 4,
        0.1
      );
    }

    // Floating animation
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.15;

    // Screen glow animation
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Laptop Base */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 1.8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Keyboard Area */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <boxGeometry args={[2.2, 0.02, 1.5]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[0.8, 0.01, 0.6]} />
        <meshStandardMaterial
          color="#222"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Screen */}
      <group position={[0, 0.8, -0.85]} rotation={[-0.2, 0, 0]}>
        {/* Screen Frame */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 1.6, 0.05]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Screen Display */}
        <mesh ref={screenRef} position={[0, 0, 0.03]} castShadow>
          <planeGeometry args={[2.3, 1.45]} />
          <meshStandardMaterial
            color="#64FFDA"
            emissive="#64FFDA"
            emissiveIntensity={0.5}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>

        {/* Screen Content (Code Visualization) */}
        <Html
          position={[0, 0, 0.04]}
          transform
          distanceFactor={1.5}
          style={{
            width: '400px',
            height: '250px',
            background: 'transparent',
            pointerEvents: 'none',
          }}
        >
          <div className="font-mono text-xs text-accent leading-relaxed opacity-70 overflow-hidden">
            <div className="animate-pulse">
              <span className="text-purple-400">const</span> portfolio = {'{'}
              <br />
              &nbsp;&nbsp;name: <span className="text-green-400">"Lokesh"</span>,
              <br />
              &nbsp;&nbsp;role: <span className="text-green-400">"Frontend Dev"</span>,
              <br />
              &nbsp;&nbsp;skills: <span className="text-yellow-400">["React", "Three.js"]</span>
              <br />
              {'}'};
            </div>
          </div>
        </Html>

        {/* Camera Notch */}
        <mesh position={[0, 0.7, 0.03]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#000" emissive="#64FFDA" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Floating Code Icons around laptop */}
      <FloatingIcons />
    </group>
  );
}

// Floating code icons/symbols
function FloatingIcons() {
  const iconsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!iconsRef.current) return;
    iconsRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  const icons = [
    { symbol: '</>', position: [2.5, 0.5, 0], color: '#64FFDA' },
    { symbol: '{ }', position: [-2.5, 0.5, 0], color: '#64FFDA' },
    { symbol: '<>', position: [0, 0.5, 2.5], color: '#64FFDA' },
    { symbol: '⚛️', position: [0, 0.5, -2.5], color: '#61DAFB' },
  ];

  return (
    <group ref={iconsRef}>
      {icons.map((icon, index) => (
        <mesh key={index} position={icon.position as [number, number, number]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={icon.color}
            emissive={icon.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Animated laptop that opens/closes
export function AnimatedLaptop() {
  const screenGroupRef = useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (screenGroupRef.current) {
      gsap.to(screenGroupRef.current.rotation, {
        x: isOpen ? -Math.PI / 3 : -0.1,
        duration: 1.5,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-open after mount
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <group onClick={() => setIsOpen(!isOpen)}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Screen (animatable) */}
      <group ref={screenGroupRef} position={[0, 0.05, -1]} rotation={[-0.1, 0, 0]}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </mesh>

        <mesh position={[0, 1, 0.06]}>
          <planeGeometry args={[2.8, 1.8]} />
          <meshStandardMaterial
            color="#64FFDA"
            emissive="#64FFDA"
            emissiveIntensity={isOpen ? 0.6 : 0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

// Preload models
try {
  useGLTF.preload('/models/laptop.glb');
} catch (e) {
  // Model not available
}

export default LaptopModel;
