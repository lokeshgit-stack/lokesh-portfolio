import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  size?: number;
  color?: string;
  opacity?: number;
  radius?: number;
  enableMouseInteraction?: boolean;
  speed?: number;
  variant?: 'stars' | 'nebula' | 'float' | 'wave' | 'spiral';
}

export function ParticleField({
  count = 5000,
  size = 0.015,
  color = '#64FFDA',
  opacity = 0.6,
  radius = 10,
  enableMouseInteraction = true,
  speed = 1,
  variant = 'stars',
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  // Generate particle positions based on variant
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      switch (variant) {
        case 'stars':
          // Random scattered particles (space-like)
          positions[i3] = (Math.random() - 0.5) * radius * 2;
          positions[i3 + 1] = (Math.random() - 0.5) * radius * 2;
          positions[i3 + 2] = (Math.random() - 0.5) * radius * 2;
          break;

        case 'nebula':
          // Clustered cloud-like distribution
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = Math.random() * radius * Math.pow(Math.random(), 2);
          positions[i3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = r * Math.cos(phi);
          break;

        case 'float':
          // Layered horizontal particles
          positions[i3] = (Math.random() - 0.5) * radius * 2;
          positions[i3 + 1] = (Math.random() - 0.5) * radius;
          positions[i3 + 2] = (Math.random() - 0.5) * radius * 2;
          break;

        case 'wave':
          // Wave pattern
          const x = (i / count) * radius * 2 - radius;
          positions[i3] = x;
          positions[i3 + 1] = Math.sin(x * 0.5) * 2;
          positions[i3 + 2] = (Math.random() - 0.5) * radius;
          break;

        case 'spiral':
          // Spiral galaxy pattern
          const angle = i * 0.1;
          const distance = (i / count) * radius;
          positions[i3] = Math.cos(angle) * distance;
          positions[i3 + 1] = (Math.random() - 0.5) * 2;
          positions[i3 + 2] = Math.sin(angle) * distance;
          break;
      }

      // Color variation for depth effect
      const colorVariation = Math.random() * 0.3;
      colors[i3] = 0.39 + colorVariation; // R
      colors[i3 + 1] = 1.0; // G (cyan/accent)
      colors[i3 + 2] = 0.85 + colorVariation; // B
    }

    return { positions, colors };
  }, [count, radius, variant]);

  // Animation loop
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Validate geometry and position attribute exist
    const geometry = pointsRef.current.geometry;
    if (!geometry || !geometry.attributes.position) return;

    const positions = geometry.attributes.position.array as Float32Array;

    switch (variant) {
      case 'stars':
        // Slow rotation
        pointsRef.current.rotation.x -= delta / 10;
        pointsRef.current.rotation.y -= delta / 15;
        break;

      case 'nebula': {
        // Swirling motion
        const angle = state.clock.elapsedTime * 0.05 * speed;
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          if (i3 + 2 < positions.length) {
            const x = positions[i3];
            const z = positions[i3 + 2];
            if (typeof x === 'number' && typeof z === 'number') {
              positions[i3] = x * Math.cos(angle * 0.1) - z * Math.sin(angle * 0.1);
              positions[i3 + 2] = x * Math.sin(angle * 0.1) + z * Math.cos(angle * 0.1);
            }
          }
        }
        geometry.attributes.position.needsUpdate = true;
        break;
      }

      case 'float': {
        // Gentle floating
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          if (i3 + 1 < positions.length) {
            const currentY = positions[i3 + 1];
            if (typeof currentY === 'number') {
              positions[i3 + 1] = currentY + Math.sin(state.clock.elapsedTime + i) * 0.001 * speed;
            }
          }
        }
        geometry.attributes.position.needsUpdate = true;
        break;
      }

      case 'wave': {
        // Wave animation
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          if (i3 + 1 < positions.length) {
            const xPos = positions[i3];
            if (typeof xPos === 'number') {
              positions[i3 + 1] = Math.sin(xPos * 0.5 + state.clock.elapsedTime * speed) * 2;
            }
          }
        }
        geometry.attributes.position.needsUpdate = true;
        break;
      }

      case 'spiral':
        // Rotating spiral
        pointsRef.current.rotation.y += 0.0005 * speed;
        break;
    }

    // Mouse interaction - particles follow mouse
    if (enableMouseInteraction) {
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        mouse.y * 0.1,
        0.02
      );
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(
        pointsRef.current.rotation.y,
        mouse.x * 0.1,
        0.02
      );
    }
  });

  return (
    <Points
      ref={pointsRef}
      positions={particles.positions}
      colors={particles.colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={opacity}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default ParticleField;
