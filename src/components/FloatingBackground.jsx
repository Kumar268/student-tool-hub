import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 1. Stars Component using InstancedMesh for performance (5000+ stars)
const SpatialStars = ({ count = 5000 }) => {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();
  
  // Dummy object for transformation calculations
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Generate random positions and scales for stars
  const starData = useMemo(() => {
    const positions = [];
    const scales = [];
    const colors = [];
    const colorChoices = ['#ffffff', '#e0e7ff', '#f3e8ff']; // white, light blue, soft purple
    
    for (let i = 0; i < count; i++) {
      // Spherical formation
      const r = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ]);
      
      scales.push(0.1 + Math.random() * 0.4);
      colors.push(new THREE.Color(colorChoices[Math.floor(Math.random() * colorChoices.length)]));
    }
    return { positions, scales, colors };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Subtle rotation over time
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.02;
      meshRef.current.rotation.x = time * 0.01;
      
      // Parallax effect on mouse move
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 2, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 2, 0.1);

      for (let i = 0; i < count; i++) {
        const { positions, scales } = starData;
        const [x, y, z] = positions[i];
        
        // Twinkling effect (opacity/scale pulse)
        const s = scales[i] * (0.8 + Math.sin(time * 2 + i) * 0.2);
        
        dummy.position.set(x, y, z);
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.8} />
    </instancedMesh>
  );
};

// 2. Central Geometric Mesh with emissive gradient
const CentralGeometric = () => {
  const meshRef = useRef();
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#4158D0', '#C850C0', '#FFCC70']; // Specification colors

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Rotation speed: 0.001 rad/frame approximated
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
      
      // Dynamic color cycling for emissive
      const t = (time % 6) / 6; // 6 second cycle
      const idx1 = Math.floor(t * colors.length);
      const idx2 = (idx1 + 1) % colors.length;
      const factor = (t * colors.length) % 1;
      
      const c1 = new THREE.Color(colors[idx1]);
      const c2 = new THREE.Color(colors[idx2]);
      meshRef.current.material.emissive.lerpColors(c1, c2, factor);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[3, 0.4, 128, 16]} />
        <meshPhysicalMaterial
          roughness={0.1}
          metalness={0.8}
          emissiveIntensity={2}
          transparent
          opacity={0.4}
          transmission={0.5}
          thickness={1}
        />
      </mesh>
    </Float>
  );
};

// Main Background Component with GPU Optimizations
const FloatingBackground = ({ isDarkMode }) => {
  const [lowPerformance, setLowPerformance] = useState(false);
  const containerRef = useRef();
  const [isInView, setIsInView] = useState(true);

  // Performance monitoring & Lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    
    // FPS Throttling Simulation
    let frames = 0;
    let lastTime = performance.now();
    const checkFPS = () => {
      const now = performance.now();
      frames++;
      if (now > lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        if (fps < 30) setLowPerformance(true);
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(checkFPS);
    };
    const frameId = requestAnimationFrame(checkFPS);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!isInView) return <div ref={containerRef} className="fixed inset-0 -z-10" />;

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 bg-black">
      <Canvas
        gl={{ 
          antialias: !lowPerformance, 
          powerPreference: "high-performance",
          alpha: false 
        }}
        dpr={lowPerformance ? 1 : [1, 2]}
        camera={{ position: [0, 0, 20], fov: 60 }}
        onCreated={({ gl }) => {
          // WebGL context loss handling
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('WebGL context lost. Attempting to restore...');
          }, false);
        }}
      >
        <color attach="background" args={[isDarkMode ? '#000000' : '#050505']} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 25]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4158D0" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C850C0" />
        
        {/* Render 5000 stars or 2500 if performance is low */}
        <SpatialStars count={lowPerformance ? 2500 : 5000} />
        
        <CentralGeometric />
        
        {/* Disposal logic is handled by R3F automatically for components */}
      </Canvas>
    </div>
  );
};

export default FloatingBackground;
