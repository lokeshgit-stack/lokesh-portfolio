import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';

interface Skill {
  name: string;
  level: number;
  icon?: string;
  color: string;
  description?: string;
}

interface SkillCubeProps {
  skill: Skill;
  position: [number, number, number];
  index: number;
}

// Animated RoundedBox component
const AnimatedRoundedBox = animated(RoundedBox);

// Single Skill Cube Component
function SkillCube({ skill, position, index }: SkillCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { mouse } = useThree();

  // Spring animation for hover effect
  const { scale, rotationY } = useSpring({
    scale: hovered ? 1.2 : 1,
    rotationY: flipped ? Math.PI : 0,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Continuous floating animation
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }

    // Subtle tilt towards mouse when hovered
    if (meshRef.current && hovered) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.y * 0.3,
        0.1
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -mouse.x * 0.3,
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <AnimatedRoundedBox
        ref={meshRef}
        args={[1, 1, 1]}
        radius={0.05}
        smoothness={4}
        scale={scale}
        rotation-y={rotationY}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => {
          setHovered(false);
          setFlipped(false);
        }}
        onClick={() => setFlipped(!flipped)}
        castShadow
        receiveShadow
      >
        {/* Front Face - Skill Name */}
        <meshStandardMaterial
          color={skill.color}
          metalness={0.6}
          roughness={0.2}
          emissive={skill.color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />

        {/* Skill Text on Front */}
        <Text
          position={[0, 0, 0.51]}
          fontSize={0.12}
          color="#0A192F"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.ttf"
          maxWidth={0.8}
        >
          {skill.name}
        </Text>

        {/* Icon/Emoji on Front */}
        {skill.icon && (
          <Text
            position={[0, 0.25, 0.51]}
            fontSize={0.2}
            anchorX="center"
            anchorY="middle"
          >
            {skill.icon}
          </Text>
        )}

        {/* Level Indicator */}
        <Text
          position={[0, -0.3, 0.51]}
          fontSize={0.08}
          color="#0A192F"
          anchorX="center"
          anchorY="middle"
        >
          {skill.level}%
        </Text>
      </AnimatedRoundedBox>

      {/* HTML Tooltip on Hover */}
      {hovered && skill.description && (
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent/30 max-w-xs">
            <p className="text-accent text-sm font-semibold mb-1">{skill.name}</p>
            <p className="text-text-secondary text-xs">{skill.description}</p>
            <p className="text-accent text-xs mt-1">Proficiency: {skill.level}%</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Main SkillCubes Component
interface SkillCubesProps {
  skills?: Skill[];
  layout?: 'grid' | 'circle' | 'spiral';
  spacing?: number;
}

export function SkillCubes({
  skills = defaultSkills,
  layout = 'grid',
  spacing = 1.8,
}: SkillCubesProps) {
  // Calculate positions based on layout
  const positions = getPositions(skills.length, layout, spacing);

  return (
    <group>
      {skills.map((skill, index) => (
        <SkillCube
          key={skill.name}
          skill={skill}
          position={positions[index] ?? [0, 0, 0]}
          index={index}
        />
      ))}
    </group>
  );
}

// Layout position calculator
function getPositions(
  count: number,
  layout: string,
  spacing: number
): [number, number, number][] {
  const positions: [number, number, number][] = [];

  switch (layout) {
    case 'grid':
      // Grid layout (3 columns)
      const cols = Math.ceil(Math.sqrt(count));
      for (let i = 0; i < count; i++) {
        const x = (i % cols) * spacing - ((cols - 1) * spacing) / 2;
        const y = Math.floor(i / cols) * -spacing;
        positions.push([x, y, 0]);
      }
      break;

    case 'circle':
      // Circular layout
      const radius = spacing * 2;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        positions.push([x, 0, z]);
      }
      break;

    case 'spiral':
      // Spiral layout
      for (let i = 0; i < count; i++) {
        const angle = i * 0.5;
        const r = i * 0.3;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = i * -0.2;
        positions.push([x, y, z]);
      }
      break;

    default:
      positions.push([0, 0, 0]);
  }

  return positions;
}

// Default skills data
const defaultSkills: Skill[] = [
  {
    name: 'React.js',
    level: 93,
    icon: '⚛️',
    color: '#61DAFB',
    description: 'Building modern UIs with hooks and components',
  },
  {
    name: 'JavaScript',
    level: 92,
    icon: '🟨',
    color: '#F7DF1E',
    description: 'ES6+ features and async programming',
  },
  {
    name: 'TypeScript',
    level: 88,
    icon: '🔷',
    color: '#3178C6',
    description: 'Type-safe application development',
  },
  {
    name: 'Node.js',
    level: 85,
    icon: '🟢',
    color: '#339933',
    description: 'Server-side JavaScript runtime',
  },
  {
    name: 'MongoDB',
    level: 88,
    icon: '🍃',
    color: '#47A248',
    description: 'NoSQL database and data modeling',
  },
  {
    name: 'Three.js',
    level: 80,
    icon: '🎮',
    color: '#000000',
    description: '3D graphics and WebGL rendering',
  },
  {
    name: 'Tailwind',
    level: 90,
    icon: '💨',
    color: '#06B6D4',
    description: 'Utility-first CSS framework',
  },
  {
    name: 'Git',
    level: 87,
    icon: '🔀',
    color: '#F05032',
    description: 'Version control and collaboration',
  },
  {
    name: 'AWS',
    level: 82,
    icon: '☁️',
    color: '#FF9900',
    description: 'Cloud services and S3 storage',
  },
];

// Alternative: Flat Card Style (2D approach)
export function SkillCards({ skills = defaultSkills }: { skills?: Skill[] }) {
  return (
    <group>
      {skills.map((skill, index) => (
        <SkillCard key={skill.name} skill={skill} index={index} />
      ))}
    </group>
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { scale, positionZ } = useSpring({
    scale: hovered ? 1.1 : 1,
    positionZ: hovered ? 0.3 : 0,
    config: { tension: 300, friction: 25 },
  });

  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.position.y =
        Math.floor(index / 3) * -1.5 + Math.sin(state.clock.elapsedTime + index) * 0.05;
    }
  });

  const x = (index % 3) * 1.5 - 1.5;
  const y = Math.floor(index / 3) * -1.5;

  return (
    <animated.group position={[x, y, 0]} scale={scale}>
      <animated.mesh
        ref={meshRef}
        position-z={positionZ}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[1.3, 0.8, 0.1]} />
        <meshStandardMaterial
          color={skill.color}
          metalness={0.5}
          roughness={0.3}
          emissive={skill.color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </animated.mesh>

      <Text
        position={[0, 0.15, 0.06]}
        fontSize={0.15}
        color="#0A192F"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.ttf"
      >
        {skill.name}
      </Text>

      <Text position={[0, -0.15, 0.06]} fontSize={0.1} color="#0A192F" anchorX="center">
        {skill.level}% {skill.icon}
      </Text>
    </animated.group>
  );
}

export default SkillCubes;
