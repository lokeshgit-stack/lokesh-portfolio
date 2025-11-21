import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  modelPath?: string;
  scale?: number;
  position?: [number, number, number];
  enableMouseTracking?: boolean;
  animationName?: string;
}

export function Avatar3D({
  modelPath = '/models/avatar.glb',
  scale = 1,
  position = [0, -1, 0],
  enableMouseTracking = true,
  animationName,
}: Avatar3DProps) {
  const group = useRef<THREE.Group>(null);
  const headBone = useRef<THREE.Bone | null>(null);
  
  // Load 3D model
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);
  
  // Mouse tracking state
  const { viewport, mouse } = useThree();
  const [hovered, setHovered] = useState(false);

  // Find head bone for mouse tracking
  useEffect(() => {
    if (scene && enableMouseTracking) {
      scene.traverse((child) => {
        if (child instanceof THREE.Bone && child.name.toLowerCase().includes('head')) {
          headBone.current = child;
        }
      });
    }
  }, [scene, enableMouseTracking]);

  // Play animation if provided
  useEffect(() => {
    if (animationName && actions[animationName]) {
      actions[animationName]?.reset().fadeIn(0.5).play();
      
      return () => {
        actions[animationName]?.fadeOut(0.5);
      };
    } else if (actions && Object.keys(actions).length > 0) {
      // Play first available animation
      const firstAction = Object.values(actions)[0];
      firstAction?.reset().fadeIn(0.5).play();
    }
  }, [actions, animationName]);

  // Mouse tracking animation
  useFrame((state) => {
    if (!group.current) return;

    // Gentle floating animation
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

    // Subtle rotation animation
    if (!hovered) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }

    // Head tracking mouse
    if (headBone.current && enableMouseTracking) {
      const target = new THREE.Vector3(
        mouse.x * viewport.width * 0.5,
        mouse.y * viewport.height * 0.5,
        1
      );
      
      headBone.current.lookAt(target);
      
      // Limit rotation to prevent unnatural angles
      headBone.current.rotation.x = THREE.MathUtils.clamp(
        headBone.current.rotation.x,
        -0.5,
        0.5
      );
      headBone.current.rotation.y = THREE.MathUtils.clamp(
        headBone.current.rotation.y,
        -0.8,
        0.8
      );
    }

    // Hover effect - slight lift
    if (hovered && group.current) {
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        position[1] + 0.2,
        0.1
      );
    }
  });

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />
    </group>
  );
}

// Alternative: Simple animated sphere avatar (fallback)
export function SimpleAvatar3D({
  scale = 2,
  position = [0, 0, 0],
}: {
  scale?: number;
  position?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;

    // Rotation based on time
    meshRef.current.rotation.y += 0.01;
    
    // Float animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;

    // Follow mouse slightly
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouse.y * 0.3,
      0.1
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      mouse.x * 0.3,
      0.1
    );
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#64FFDA"
        roughness={0.2}
        metalness={0.8}
        wireframe={false}
      />
    </mesh>
  );
}

// Stylized geometric avatar
export function GeometricAvatar3D() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Continuous rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    
    // Float effect
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;

    // Tilt based on mouse
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.5,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#64FFDA" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Body */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1, 1, 0.5]} />
        <meshStandardMaterial color="#112240" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 0.6, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#0A192F" emissive="#64FFDA" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.2, 0.6, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#0A192F" emissive="#64FFDA" emissiveIntensity={0.5} />
      </mesh>

      {/* Orbiting particles */}
      <mesh position={[1.5, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#64FFDA" />
      </mesh>
      <mesh position={[-1.5, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#64FFDA" />
      </mesh>
      <mesh position={[0, 0, 1.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#64FFDA" />
      </mesh>
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload('/models/avatar.glb');

export default Avatar3D;
