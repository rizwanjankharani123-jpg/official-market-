import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Services3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 4, 50);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);

    // Floating Geometric Tech & Growth Cubes / Pyramids
    const group = new THREE.Group();
    scene.add(group);

    const geometries = [
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.OctahedronGeometry(1),
      new THREE.TetrahedronGeometry(1)
    ];

    const objects: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const geo = geometries[i % geometries.length];
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x6366f1 : 0x06b6d4,
        wireframe: i % 3 === 0,
        roughness: 0.2,
        metalness: 0.8,
        emissive: i % 2 === 0 ? 0x6366f1 : 0x06b6d4,
        emissiveIntensity: 0.3
      });
      const mesh = new THREE.Mesh(geo, mat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      );
      group.add(mesh);
      objects.push(mesh);
    }

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      group.rotation.y = elapsedTime * 0.15;
      group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;

      objects.forEach((obj, idx) => {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.015;
        obj.position.y += Math.sin(elapsedTime * 2 + idx) * 0.003;
      });

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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 z-0" />
  );
};
