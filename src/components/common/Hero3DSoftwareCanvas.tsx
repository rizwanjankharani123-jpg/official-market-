import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DSoftwareCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, High-performance WebGL Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050914, 0.022);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2.2, 9.5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- CINEMATIC LIGHTING SUITE ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 7, 35);
    cyanLight.position.set(3, 4.5, 4);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 6, 35);
    emeraldLight.position.set(-3.5, -2, 3);
    scene.add(emeraldLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 5, 30);
    violetLight.position.set(0, 6, -3.5);
    scene.add(violetLight);

    // --- 3D SOFTWARE & APK HOLOGRAPHIC ECOSYSTEM ---
    const ecosystemGroup = new THREE.Group();
    scene.add(ecosystemGroup);

    // 1. Central Holographic Master Crystal (Main APK/Software Engine Node)
    const centralGeo = new THREE.BoxGeometry(2.1, 2.1, 2.1);
    const centralMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      metalness: 0.15,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.8,
      ior: 1.5,
      emissive: 0x005577,
      emissiveIntensity: 0.3
    });
    const centralMesh = new THREE.Mesh(centralGeo, centralMat);
    ecosystemGroup.add(centralMesh);

    // Inner wireframe emerald diamond core
    const innerGeo = new THREE.OctahedronGeometry(1.2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    ecosystemGroup.add(innerMesh);

    // Glowing Holographic Rings around the central core
    const ringCount = 3;
    const coreRings: THREE.Mesh[] = [];
    for (let r = 0; r < ringCount; r++) {
      const ringGeo = new THREE.TorusGeometry(1.8 + r * 0.45, 0.022, 16, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0x00f2fe : 0x10b981,
        transparent: true,
        opacity: 0.55,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ecosystemGroup.add(ring);
      coreRings.push(ring);
    }

    // 2. Orbiting Floating 3D APK Packages / Software Nodes (Satellites)
    const satelliteCount = 10;
    const satellites: {
      mesh: THREE.Mesh;
      orbitRadius: number;
      speed: number;
      angle: number;
      yOffset: number;
      rotSpeedX: number;
      rotSpeedY: number;
    }[] = [];

    const colors = [0x00f2fe, 0x10b981, 0x6366f1, 0xf59e0b, 0x38bdf8];

    for (let i = 0; i < satelliteCount; i++) {
      const size = 0.35 + Math.random() * 0.35;
      const geomType = i % 3;
      let geom: THREE.BufferGeometry;

      if (geomType === 0) {
        geom = new THREE.BoxGeometry(size, size * 1.3, size * 0.7); // APK box shape
      } else if (geomType === 1) {
        geom = new THREE.OctahedronGeometry(size * 0.8);
      } else {
        geom = new THREE.DodecahedronGeometry(size * 0.6);
      }

      const color = colors[i % colors.length];
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.85,
        roughness: 0.15,
        emissive: color,
        emissiveIntensity: 0.5
      });

      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      satellites.push({
        mesh,
        orbitRadius: 3.4 + Math.random() * 2.8,
        speed: 0.4 + Math.random() * 0.6,
        angle: (i / satelliteCount) * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 3.2,
        rotSpeedX: 0.01 + Math.random() * 0.02,
        rotSpeedY: 0.01 + Math.random() * 0.02
      });
    }

    // 3. Futuristic Cyber Matrix Floor Grid
    const gridHelper = new THREE.GridHelper(60, 40, 0x00f2fe, 0x132038);
    gridHelper.position.y = -2.8;
    scene.add(gridHelper);

    // 4. Floating Holographic Data Particles (VFX Starfield & Dust)
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = (Math.random() - 0.5) * 24;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.09,
      transparent: true,
      opacity: 0.8
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Mouse & Touch Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

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

      camera.position.x = targetX * 1.8;
      camera.position.y = 2.2 + targetY * 1.2;
      camera.lookAt(0, 0.5, 0);

      // Rotate central holographic software core
      centralMesh.rotation.x = elapsedTime * 0.5;
      centralMesh.rotation.y = elapsedTime * 0.7;

      innerMesh.rotation.x = -elapsedTime * 0.7;
      innerMesh.rotation.y = -elapsedTime * 0.5;

      // Float central mesh up & down
      const floatY = Math.sin(elapsedTime * 1.8) * 0.35;
      centralMesh.position.y = floatY;
      innerMesh.position.y = floatY;

      // Animate core rings
      coreRings.forEach((ring, idx) => {
        ring.position.y = floatY;
        ring.rotation.x = Math.PI / 2 + Math.sin(elapsedTime + idx) * 0.2;
        ring.rotation.y = elapsedTime * (0.3 + idx * 0.2) * (idx % 2 === 0 ? 1 : -1);
      });

      // Orbit satellites (APK / code nodes)
      satellites.forEach((sat) => {
        sat.angle += sat.speed * 0.012;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.orbitRadius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.orbitRadius;
        sat.mesh.position.y = sat.yOffset + Math.sin(elapsedTime * 2 + sat.angle) * 0.6;

        sat.mesh.rotation.x += sat.rotSpeedX;
        sat.mesh.rotation.y += sat.rotSpeedY;
      });

      // Slowly rotate particle field
      particleField.rotation.y = elapsedTime * 0.04;
      particleField.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement.parentNode === container) {
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
