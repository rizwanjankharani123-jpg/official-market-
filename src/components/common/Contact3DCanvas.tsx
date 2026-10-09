import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Contact3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f2fe, 3, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 3, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Group for 3D Mobile / Message Device
    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // 1. Phone Body (Rounded Box)
    const phoneGeo = new THREE.BoxGeometry(2.4, 4.8, 0.25);
    const phoneMat = new THREE.MeshStandardMaterial({
      color: 0x0c1427,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.15
    });
    const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
    deviceGroup.add(phoneMesh);

    // 2. Phone Screen / Display bezel glow
    const screenGeo = new THREE.PlaneGeometry(2.2, 4.6);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x070b14,
      side: THREE.DoubleSide
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.135;
    deviceGroup.add(screenMesh);

    // 3. Floating 3D Message Bubbles around Phone
    const bubbleCount = 8;
    const bubbles: THREE.Mesh[] = [];
    const bubbleGeo = new THREE.BoxGeometry(0.8, 0.4, 0.1);
    
    for (let i = 0; i < bubbleCount; i++) {
      const bubbleMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x00f2fe : 0x10b981,
        emissive: i % 2 === 0 ? 0x00f2fe : 0x10b981,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.85
      });
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      
      const angle = (i / bubbleCount) * Math.PI * 2;
      const radius = 2.5 + Math.sin(i) * 0.5;
      bubble.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * 1.5,
        (Math.random() - 0.5) * 2
      );
      scene.add(bubble);
      bubbles.push(bubble);
    }

    // 4. Glowing Particle Stream
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.06,
      transparent: true,
      opacity: 0.7
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse interactivity
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate phone gently & react to mouse
      deviceGroup.rotation.y = elapsedTime * 0.3 + mouseX * 0.5;
      deviceGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2 + mouseY * 0.5;
      deviceGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

      // Float bubbles
      bubbles.forEach((bubble, idx) => {
        bubble.rotation.x += 0.01;
        bubble.rotation.y += 0.02;
        bubble.position.y += Math.sin(elapsedTime + idx) * 0.005;
      });

      // Rotate particle system
      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0" />
  );
};
