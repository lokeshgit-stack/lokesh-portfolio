import { useRef, useState, useEffect, RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Use3DInteractionOptions {
  enableMouseTracking?: boolean;
  enableHover?: boolean;
  enableClick?: boolean;
  rotationSpeed?: number;
  hoverScale?: number;
  clickScale?: number;
  smoothing?: number;
}

interface Use3DInteractionReturn {
  meshRef: RefObject<THREE.Mesh>;
  isHovered: boolean;
  isClicked: boolean;
  mousePosition: { x: number; y: number };
}

export const use3DInteraction = ({
  enableMouseTracking = true,
  enableHover = true,
  enableClick = true,
  rotationSpeed = 0.01,
  hoverScale = 1.1,
  clickScale = 0.95,
  smoothing = 0.1,
}: Use3DInteractionOptions = {}): Use3DInteractionReturn => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { mouse, viewport } = useThree();

  // Mouse position state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Target scale and rotation for smooth animations
  const targetScale = useRef(1);
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    // Update target scale based on interaction state
    if (isClicked) {
      targetScale.current = clickScale;
    } else if (isHovered) {
      targetScale.current = hoverScale;
    } else {
      targetScale.current = 1;
    }
  }, [isHovered, isClicked, hoverScale, clickScale]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Mouse tracking - rotate based on mouse position
    if (enableMouseTracking) {
      const x = mouse.x * viewport.width * 0.5;
      const y = mouse.y * viewport.height * 0.5;

      // Smooth rotation towards mouse
      targetRotation.current.x = THREE.MathUtils.lerp(
        targetRotation.current.x,
        mouse.y * 0.5,
        smoothing
      );
      targetRotation.current.y = THREE.MathUtils.lerp(
        targetRotation.current.y,
        mouse.x * 0.5,
        smoothing
      );

      if (!isHovered) {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          targetRotation.current.x,
          smoothing
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetRotation.current.y,
          smoothing
        );
      }

      setMousePosition({ x, y });
    }

    // Continuous rotation when not hovered
    if (!isHovered && rotationSpeed > 0) {
      meshRef.current.rotation.y += rotationSpeed;
    }

    // Smooth scale transition
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, smoothing);
    meshRef.current.scale.set(newScale, newScale, newScale);
  });

  return {
    meshRef,
    isHovered,
    isClicked,
    mousePosition,
  };
};

// Advanced 3D interaction hook with more features
interface UseAdvanced3DInteractionOptions extends Use3DInteractionOptions {
  enableAutoRotate?: boolean;
  autoRotateSpeed?: number;
  enableFloat?: boolean;
  floatAmplitude?: number;
  floatSpeed?: number;
  dampingFactor?: number;
}

export const useAdvanced3DInteraction = ({
  enableMouseTracking = true,
  enableHover = true,
  enableAutoRotate = true,
  autoRotateSpeed = 0.005,
  enableFloat = true,
  floatAmplitude = 0.2,
  floatSpeed = 1,
  dampingFactor = 0.05,
  hoverScale = 1.1,
  smoothing = 0.1,
}: UseAdvanced3DInteractionOptions = {}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { mouse } = useThree();

  const initialPosition = useRef(new THREE.Vector3());
  const targetRotation = useRef(new THREE.Euler());

  useEffect(() => {
    if (meshRef.current) {
      initialPosition.current.copy(meshRef.current.position);
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Auto-rotation
    if (enableAutoRotate && !isHovered) {
      meshRef.current.rotation.y += autoRotateSpeed;
    }

    // Floating animation
    if (enableFloat) {
      const floatY =
        Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
      meshRef.current.position.y =
        initialPosition.current.y + floatY;
    }

    // Mouse tracking with damping
    if (enableMouseTracking && isHovered) {
      targetRotation.current.x = mouse.y * Math.PI * 0.1;
      targetRotation.current.y = mouse.x * Math.PI * 0.1;

      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotation.current.x,
        dampingFactor
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation.current.y,
        dampingFactor
      );
    }

    // Scale animation
    const targetScale = isHovered ? hoverScale : 1;
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, smoothing);
    meshRef.current.scale.set(newScale, newScale, newScale);
  });

  return {
    meshRef,
    isHovered,
    setIsHovered,
  };
};

// Hook for camera interactions
export const useCamera3DInteraction = (
  options: {
    enableMousePan?: boolean;
    panSpeed?: number;
    enableZoom?: boolean;
    zoomSpeed?: number;
  } = {}
) => {
  const { camera, gl } = useThree();
  const { enableMousePan = true, panSpeed = 0.5, enableZoom = false, zoomSpeed = 0.1 } = options;

  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (event: WheelEvent) => {
      if (enableZoom) {
        event.preventDefault();
        camera.position.z += event.deltaY * zoomSpeed * 0.01;
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, 2, 20);
      }
    };

    if (enableZoom) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [camera, gl, enableZoom, zoomSpeed]);

  return { camera };
};

export default use3DInteraction;
