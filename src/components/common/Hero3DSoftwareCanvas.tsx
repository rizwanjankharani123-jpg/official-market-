import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DSoftwareCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.025);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Cinematic Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 6, 30);
    cyanLight.position.set(2, 4, 3);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 5, 30);
    emeraldLight.position.set(-3, -2, 2);
    scene.add(emeraldLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 4, 30);
    purpleLight.position.set(0, 5, -3);
    scene.add(purpleLight);

    // --- 3D SOFTWARE & APK HOLOGRAPHIC ECOSYSTEM ---
    const ecosystemGroup = new THREE.Group();
    scene.add(ecosystemGroup);

    // 1. Central Holographic APK / Software Cube (Main Node)
    const centralGeo = new THREE.BoxGeometry(2, 2, 2);
    const centralMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.75,
      wireframe: false
    });
    const centralMesh = new THREE.Mesh(centralGeo, centralMat);
    ecosystemGroup.add(centralMesh);

    // Inner wireframe core for high-tech look
    const innerGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    ecosystemGroup.add(innerMesh);

    // 2. Orbiting Floating 3D APK Packages / Code Nodes (Satellites)
    const satelliteCount = 8;
    const satellites: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; yOffset: number }[] = [];

    for (let i = 0; i < satelliteCount; i++) {
      const size = 0.4 + Math.random() * 0.4;
      const geom = i % 2 === 0 ? new THREE.BoxGeometry(size, size, size) : new THREE.OctahedronGeometry(size * 0.7);
      
      const colors = [0x00f0ff, 0x10b981, 0x8b5cf6, 0xf59e0b];
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        metalness: 0.8,
        roughness: 0.2,
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.6
      });

      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      satellites.push({
        mesh,
        orbitRadius: 3.2 + Math.random() * 2.5,
        speed: 0.5 + Math.random() * 0.8,
        angle: (i / satelliteCount) * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 3
      });
    }

    // --- CYBERPUNK DATA MATRIX FLOOR ---
    const gridHelper = new THREE.GridHelper(50, 35, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    // --- FLOATING QUANTUM DATA PARTICLES (VFX Dust) ---
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 35;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 35;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.75
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 1.5;
      camera.position.y = 2 + targetY * 1;
      camera.lookAt(0, 0, 0);

      // Rotate central holographic software core
      centralMesh.rotation.x = elapsedTime * 0.6;
      centralMesh.rotation.y = elapsedTime * 0.8;

      innerMesh.rotation.x = -elapsedTime * 0.8;
      innerMesh.rotation.y = -elapsedTime * 0.5;

      // Float central mesh up & down
      centralMesh.position.y = Math.sin(elapsedTime * 2) * 0.3;
      innerMesh.position.y = Math.sin(elapsedTime * 2) * 0.3;

      // Orbit satellites (APK / code nodes)
      satellites.forEach((sat) => {
        sat.angle += sat.speed * 0.01;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.orbitRadius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.orbitRadius;
        sat.mesh.position.y = sat.yOffset + Math.sin(elapsedTime * 2 + sat.angle) * 0.5;

        sat.mesh.rotation.x += 0.02;
        sat.mesh.rotation.y += 0.03;
      });

      // Rotate particle field slowly
      particleField.rotation.y = elapsedTime * 0.05;

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
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl z-0 opacity-90">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
