import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DDriftCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const neonCyanLight = new THREE.PointLight(0x00f0ff, 5, 25);
    neonCyanLight.position.set(0, 4, 3);
    scene.add(neonCyanLight);

    const neonEmeraldLight = new THREE.PointLight(0x10b981, 4, 25);
    neonEmeraldLight.position.set(-3, 2, -2);
    scene.add(neonEmeraldLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // --- 3D DRIFTING SPORTS CAR GROUP ---
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Car Body (Sleek futuristic cyber design)
    const bodyGeometry = new THREE.BoxGeometry(2.2, 0.6, 4.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c1220,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x004466,
      emissiveIntensity: 0.4
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.5;
    bodyMesh.castShadow = true;
    carGroup.add(bodyMesh);

    // Cabin / Windshield
    const cabinGeometry = new THREE.BoxGeometry(1.6, 0.5, 2.2);
    const cabinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: 0.6
    });
    const cabinMesh = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabinMesh.position.set(0, 0.95, -0.2);
    carGroup.add(cabinMesh);

    // Glowing Neon Headlights (Drifting forward effect)
    const headlightGeo = new THREE.BoxGeometry(0.5, 0.15, 0.1);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    
    const leftHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
    leftHeadlight.position.set(-0.8, 0.5, 2.26);
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
    rightHeadlight.position.set(0.8, 0.5, 2.26);
    carGroup.add(rightHeadlight);

    // Wheels (4 rotating glowing wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 24);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.3,
      metalness: 0.8
    });

    const wheelPositions = [
      [-1.2, 0.4, 1.4],   // Front Left
      [1.2, 0.4, 1.4],    // Front Right
      [-1.2, 0.4, -1.4],  // Rear Left
      [1.2, 0.4, -1.4]    // Rear Right
    ];

    const wheels: THREE.Mesh[] = [];
    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      carGroup.add(wheel);
      wheels.push(wheel);
    });

    // --- CYBERPUNK GRID FLOOR (Moving / Drifting Effect) ---
    const gridHelper = new THREE.GridHelper(60, 40, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // --- FLOATING NEON PARTICLES (VFX Starfield) ---
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = Math.random() * 15;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.12,
      transparent: true,
      opacity: 0.8
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop (Drifting motion & VFX rotation)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 2;
      camera.position.y = 3 + targetY * 1;
      camera.lookAt(0, 0, 0);

      // Car Drifting Animation (Cinematic side drift & floating bounce)
      carGroup.position.x = Math.sin(elapsedTime * 1.5) * 1.2;
      carGroup.position.z = Math.cos(elapsedTime * 1.0) * 0.5;
      carGroup.rotation.y = Math.sin(elapsedTime * 1.5) * 0.3 + 0.2;
      carGroup.rotation.z = Math.sin(elapsedTime * 3) * 0.05; // Drift tilt

      // Rotate wheels
      wheels.forEach((wheel, idx) => {
        wheel.rotation.x += 0.15;
        if (idx < 2) {
          wheel.rotation.y = Math.sin(elapsedTime * 1.5) * 0.3; // Steering angle
        }
      });

      // Move grid forward for speed illusion
      gridHelper.position.z = (elapsedTime * 5) % 3;

      // Pulse neon lights
      neonCyanLight.intensity = 4 + Math.sin(elapsedTime * 5) * 2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl z-0 opacity-85">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
