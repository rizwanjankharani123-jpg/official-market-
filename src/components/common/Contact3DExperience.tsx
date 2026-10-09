import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, MessageSquare, ShieldCheck, ArrowRight, X, Play, RefreshCw, Smartphone } from 'lucide-react';

interface Contact3DExperienceProps {
  onComplete: () => void;
  onClose?: () => void;
  autoCloseDelay?: number; // in milliseconds, default 5000
}

export const Contact3DExperience: React.FC<Contact3DExperienceProps> = ({
  onComplete,
  onClose,
  autoCloseDelay = 5500
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING SECURE LINK...');
  const [messageDelivered, setMessageDelivered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14); // starts zoomed out for dramatic cinematic fly-in

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Dynamic High-Res Screen Texture
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const ctx = screenCanvas.getContext('2d')!;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Helper to render high-tech screen content
    let animPhase = 0;
    const drawScreen = (phase: number, delivered: boolean) => {
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(0.5, '#040711');
      bgGrad.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 512, 1024);

      // Cyber Grid on screen
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 512; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
      for (let y = 0; y < 1024; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Top Status Bar
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('09:41', 40, 50);
      ctx.fillText('5G ⚡ 100%', 360, 50);

      // Glowing Brand Header
      ctx.fillStyle = '#00f2fe';
      ctx.font = '900 38px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 15;
      ctx.fillText('AFFY OFFICIAL', 256, 130);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 18px sans-serif';
      ctx.fillText('OFFICIAL COMMUNICATION HUB', 256, 165);

      // Divider Line
      const divGrad = ctx.createLinearGradient(60, 190, 452, 190);
      divGrad.addColorStop(0, 'transparent');
      divGrad.addColorStop(0.5, '#00f2fe');
      divGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = divGrad;
      ctx.fillRect(60, 190, 392, 3);

      // Interactive Contact Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, 220, 432, 190, 20);
      ctx.fill();
      ctx.stroke();

      // Avatar Circle
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(95, 275, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = '900 24px monospace';
      ctx.fillText('AO', 95, 283);

      // Contact Name & Title
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('Aftab Khan', 145, 268);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('● LEAD ENGINEER / AFFY', 145, 296);

      // Direct WhatsApp highlight
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.fillText('+92 326 3724861', 65, 360);
      ctx.fillText('affyofficial.dev@gmail.com', 65, 385);

      // Chat Messages Flow
      // Incoming bubble from user
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.roundRect(40, 440, 340, 90, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '18px sans-serif';
      ctx.fillText('Inquiry: Custom APK / Web App', 60, 480);
      ctx.fillStyle = '#64748b';
      ctx.font = '14px monospace';
      ctx.fillText('Direct Consultation Request', 60, 508);

      // Outgoing Transmission Bubble with "Message Delivered"
      const outBubbleY = 560;
      ctx.fillStyle = delivered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.15)';
      ctx.strokeStyle = delivered ? '#10b981' : '#00f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(132, outBubbleY, 340, 120, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Encrypted Transmission', 152, outBubbleY + 40);

      // Pulsing Transmission / Delivered Status
      if (delivered) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 22px monospace';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.fillText('✓✓ MESSAGE DELIVERED', 152, outBubbleY + 80);
        ctx.shadowBlur = 0;
      } else {
        const dots = '.'.repeat(Math.floor(phase * 4) % 4 + 1);
        ctx.fillStyle = '#00f2fe';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`TRANSMITTING${dots}`, 152, outBubbleY + 80);
      }

      // Signal radar wave at bottom
      ctx.textAlign = 'center';
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 16px monospace';
      ctx.fillText('SECURE DISPATCH TERMINAL READY', 256, 920);

      // Home bar
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(176, 980, 160, 6, 3);
      ctx.fill();

      screenTexture.needsUpdate = true;
    };

    drawScreen(0, false);

    // 3. 3D Mobile Phone Geometry & Materials
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Chassis (Titanium dark body with rounded chamfers)
    const phoneWidth = 2.6;
    const phoneHeight = 5.2;
    const phoneDepth = 0.28;

    const chassisGeo = new THREE.BoxGeometry(phoneWidth, phoneHeight, phoneDepth);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0a1122,
      metalness: 0.95,
      roughness: 0.12,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.08
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.castShadow = true;
    phoneGroup.add(chassisMesh);

    // Metallic Outer Edge Rim (Accent neon edge)
    const rimGeo = new THREE.BoxGeometry(phoneWidth + 0.06, phoneHeight + 0.06, phoneDepth - 0.05);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 1,
      roughness: 0.2,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.4
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    phoneGroup.add(rimMesh);

    // Screen Mesh with Canvas Texture
    const screenGeo = new THREE.PlaneGeometry(phoneWidth - 0.15, phoneHeight - 0.2);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = phoneDepth / 2 + 0.005;
    phoneGroup.add(screenMesh);

    // Camera Module on Back
    const camBumpGeo = new THREE.BoxGeometry(1.0, 1.2, 0.08);
    const camBumpMat = new THREE.MeshStandardMaterial({
      color: 0x070c18,
      metalness: 0.9,
      roughness: 0.2
    });
    const camBump = new THREE.Mesh(camBumpGeo, camBumpMat);
    camBump.position.set(-0.6, 1.8, -phoneDepth / 2 - 0.04);
    phoneGroup.add(camBump);

    // 3 Camera Lenses
    for (let l = 0; l < 3; l++) {
      const lensGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 32);
      const lensMat = new THREE.MeshStandardMaterial({
        color: 0x002233,
        metalness: 0.9,
        roughness: 0.05,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.3
      });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(-0.6, 1.5 + l * 0.35, -phoneDepth / 2 - 0.09);
      phoneGroup.add(lens);
    }

    // 4. Holographic Transmission Rings (Expanding from phone)
    const ringCount = 3;
    const rings: THREE.Mesh[] = [];
    for (let r = 0; r < ringCount; r++) {
      const ringGeo = new THREE.TorusGeometry(2.8 + r * 0.6, 0.02, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0x00f2fe : 0x10b981,
        transparent: true,
        opacity: 0.6,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      rings.push(ring);
    }

    // 5. 3D Floating Particle Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 16;
      particlePos[i + 1] = (Math.random() - 0.5) * 12;
      particlePos[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.06,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Realistic Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 5, 25);
    cyanLight.position.set(4, 3, 4);
    scene.add(cyanLight);

    const greenLight = new THREE.PointLight(0x10b981, 4, 25);
    greenLight.position.set(-4, -2, 3);
    scene.add(greenLight);

    const topSpot = new THREE.SpotLight(0xffffff, 3);
    topSpot.position.set(0, 10, 5);
    topSpot.angle = Math.PI / 4;
    scene.add(topSpot);

    // 7. Mouse Orbit Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / width) * 2 - 1;
        const normY = -((e.clientY - rect.top) / height) * 2 + 1;
        targetRotY = normX * 0.6;
        targetRotX = -normY * 0.4;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const normX = ((touch.clientX - rect.left) / width) * 2 - 1;
        const normY = -((touch.clientY - rect.top) / height) * 2 + 1;
        targetRotY = normX * 0.7;
        targetRotX = -normY * 0.4;
      }
    };
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // 8. Animation Loop & Timeline
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const realElapsedMs = performance.now() - startTime;

      // Progress computation
      const currProgress = Math.min(100, Math.floor((realElapsedMs / autoCloseDelay) * 100));
      setProgress(currProgress);

      if (currProgress > 40 && !messageDelivered) {
        setMessageDelivered(true);
        setStatusText('✓ MESSAGE DELIVERED TO AFFY OFFICIAL');
      }

      // Smooth camera fly-in from darkness (14 down to 6.2)
      if (camera.position.z > 6.2) {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.2, 0.035);
      }

      // Smooth rotation with slight idle floating
      const idleFloat = Math.sin(elapsed * 2) * 0.1;
      phoneGroup.position.y = idleFloat;
      phoneGroup.rotation.y = THREE.MathUtils.lerp(phoneGroup.rotation.y, targetRotY + Math.sin(elapsed) * 0.15, 0.08);
      phoneGroup.rotation.x = THREE.MathUtils.lerp(phoneGroup.rotation.x, targetRotX + Math.cos(elapsed * 1.5) * 0.08, 0.08);

      // Animate Holographic Rings
      rings.forEach((ring, idx) => {
        ring.rotation.z += 0.01 * (idx % 2 === 0 ? 1 : -1);
        ring.rotation.x += 0.005;
        const scaleVal = 1 + Math.sin(elapsed * 2 + idx) * 0.15;
        ring.scale.set(scaleVal, scaleVal, scaleVal);
      });

      // Animate Particles
      particles.rotation.y = elapsed * 0.04;

      // Update Screen Texture
      animPhase += 0.02;
      drawScreen(animPhase, currProgress > 40);

      renderer.render(scene, camera);
    };

    animate();

    // Auto-complete timer
    const timer = setTimeout(() => {
      onComplete();
    }, autoCloseDelay);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      screenTexture.dispose();
    };
  }, [autoCloseDelay, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020611]/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden">
      {/* 3D WebGL Canvas Layer */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Futuristic Header HUD */}
      <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-black text-cyan-400 tracking-wider">AFFY OFFICIAL // 3D VFX TRANSMISSION</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">Direct Contact & Communication Portal</h1>
          </div>
        </div>

        {/* Skip / Close Button */}
        <button
          onClick={onClose || onComplete}
          className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg backdrop-blur-sm"
        >
          <span>Skip 3D Intro</span>
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Interactive Guidance Badge */}
      <div className="relative z-10 self-center pointer-events-none text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive 3D: Drag with mouse/touch to rotate mobile in real-time</span>
        </div>
      </div>

      {/* Bottom Action HUD & Status */}
      <div className="relative z-10 p-4 sm:p-8 max-w-3xl mx-auto w-full pointer-events-auto space-y-4 text-center">
        {/* Dynamic Status Notification */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#0a1122]/90 border border-cyan-500/30 shadow-2xl backdrop-blur-md">
          {messageDelivered ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
          )}
          <span className={`text-xs sm:text-sm font-mono font-bold ${messageDelivered ? 'text-emerald-400' : 'text-cyan-300'}`}>
            {statusText}
          </span>
        </div>

        {/* Progress Timeline Bar */}
        <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-100 ease-linear shadow-lg shadow-cyan-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Big Action Button to Open Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onComplete}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:brightness-110 text-black font-black text-sm sm:text-base font-mono flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/30 cursor-pointer active:scale-95 transition-all"
          >
            <MessageSquare className="w-5 h-5 text-black" />
            <span>Open Official Contact Section Now</span>
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </div>

        <p className="text-[11px] font-mono text-slate-400">
          WhatsApp: +92 326 3724861 · Broadcast Channel · Direct Email
        </p>
      </div>
    </div>
  );
};
