import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, Code2, Layers, RotateCw, Sparkles, Terminal, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export type LaptopScreenMode = 'code' | 'web' | 'split';
export type LaptopTheme = 'cyber-cyan' | 'space-gray' | 'obsidian-gold';

interface RealisticLaptop3DCanvasProps {
  initialMode?: LaptopScreenMode;
  autoRotate?: boolean;
  className?: string;
  height?: string;
}

export const RealisticLaptop3DCanvas: React.FC<RealisticLaptop3DCanvasProps> = ({
  initialMode = 'code',
  autoRotate = true,
  className = '',
  height = 'h-[460px] sm:h-[580px] lg:h-[640px]'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenMode, setScreenMode] = useState<LaptopScreenMode>(initialMode);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [activeViewPreset, setActiveViewPreset] = useState<'front' | 'angled' | 'top'>('front');

  // Three.js References
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const laptopGroupRef = useRef<THREE.Group | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const isInteractingRef = useRef(false);
  const screenModeRef = useRef<LaptopScreenMode>(screenMode);

  // Mouse Parallax Trackers
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    screenModeRef.current = screenMode;
  }, [screenMode]);

  // High-Tech Syntax Highlighted Code for Live Screen Engine
  const codeLines = [
    `// ===============================================`,
    `// AFFY OFFICIAL ENTERPRISE ARCHITECTURE`,
    `// Lead Engineer: Aftab (CodeWithAffy)`,
    `// ===============================================`,
    `import { AffyCore, AndroidEngine } from '@affyofficial/core';`,
    `import { SecurityShield, WebVFX } from '@affyofficial/system';`,
    ``,
    `export const AFFY_DEVELOPER_SPEC = {`,
    `  author: "Aftab",`,
    `  brand: "AFFY OFFICIAL",`,
    `  roles: ["Full-Stack Web Architect", "Android APK Developer"],`,
    `  verification: "100% MALWARE-FREE & VERIFIED",`,
    `  runtime: "Vite 8.3 + React 19 + Three.js WebGL",`,
    `  directSupport: "+92 326 3724861 (WhatsApp)",`,
    `  status: "ONLINE & PRODUCTION READY"`,
    `};`,
    ``,
    `export async function runAffyServices() {`,
    `  console.log("⚡ [AFFY-INIT] Launching 3D WebGL Ecosystem...");`,
    `  await SecurityShield.auditAllPackages();`,
    `  const apks = await AndroidEngine.verifyBuilds();`,
    `  console.log("🚀 [AFFY-OK] " + apks.length + " Verified APKs Ready for Download");`,
    `  console.log("📦 [AFFY-OK] Commercial Source Packages Packaged");`,
    `  return { active: true, responseTimeMs: 12 };`,
    `}`,
    ``,
    `// Terminal Real-Time Compilation:`,
    `[AFFY-DEV] Compiling src/App.tsx with WebGL VFX...`,
    `[AFFY-DEV] ✓ Build finished in 280ms [100% Success]`,
    `[AFFY-DEV] ⚡ Active Server Live at https://affyofficial.dev`,
    `[AFFY-DEV] All 142 Security Protocols Passed ✓`
  ];

  // Draw 2K Dynamic Screen Graphics
  const drawScreen = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const mode = screenModeRef.current;
    ctx.clearRect(0, 0, width, height);

    if (mode === 'code') {
      // IDE Mode: Dark Obsidian Editor
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#080d1a');
      bgGrad.addColorStop(1, '#040710');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // IDE Titlebar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, 56);

      // Window Action Dots
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(32, 28, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(60, 28, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(88, 28, 9, 0, Math.PI * 2);
      ctx.fill();

      // Active File Tab
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(130, 8, 300, 48);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('⚡ AffyOfficialEngine.tsx', 150, 38);

      ctx.fillStyle = '#64748b';
      ctx.font = '18px monospace';
      ctx.fillText('AndroidBuild.kt', 460, 38);
      ctx.fillText('affyofficial.dev [Live]', 680, 38);

      // Subtle Background Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 56);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Sidebar Line Numbers
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 56, 75, height - 56);

      // Draw Dynamic Code Lines
      const startY = 100;
      const lineHeight = 32;
      const visibleLines = Math.floor((height - 180) / lineHeight);
      const scrollOffset = Math.floor(time * 1.8) % Math.max(1, codeLines.length - 12);

      for (let i = 0; i < visibleLines; i++) {
        const lineIdx = (scrollOffset + i) % codeLines.length;
        const line = codeLines[lineIdx] || '';
        const y = startY + i * lineHeight;

        ctx.fillStyle = '#475569';
        ctx.font = '18px monospace';
        ctx.fillText(String(lineIdx + 1).padStart(3, ' '), 18, y);

        if (line.startsWith('//')) {
          ctx.fillStyle = '#10b981';
        } else if (line.startsWith('import') || line.startsWith('export') || line.startsWith('return')) {
          ctx.fillStyle = '#c084fc';
        } else if (line.includes('[AFFY-')) {
          ctx.fillStyle = '#38bdf8';
        } else if (line.includes('Aftab') || line.includes('CodeWithAffy') || line.includes('AFFY OFFICIAL')) {
          ctx.fillStyle = '#f59e0b';
        } else if (line.includes('const') || line.includes('function')) {
          ctx.fillStyle = '#60a5fa';
        } else {
          ctx.fillStyle = '#e2e8f0';
        }
        ctx.font = 'bold 20px monospace';
        ctx.fillText(line, 95, y);
      }

      // Terminal Output Tray at Bottom
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, height - 90, width, 90);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height - 90);
      ctx.lineTo(width, height - 90);
      ctx.stroke();

      const cursorBlink = Math.sin(time * 6) > 0 ? '█' : ' ';
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`➜ aftab@affyofficial:~$ yarn test:prod ${cursorBlink}`, 30, height - 52);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '16px monospace';
      ctx.fillText(`[ENGINE STATUS] Node.js v22 • React 19 • 100% Virus-Free • 0 ERRORS`, 30, height - 20);

    } else if (mode === 'web') {
      // Web Mode: Real-Time AFFY OFFICIAL Browser
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Browser Chrome Top Bar
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, 70);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(32, 35, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(60, 35, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(88, 35, 9, 0, Math.PI * 2);
      ctx.fill();

      // Browser Omnibox URL
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.roundRect(130, 16, width - 260, 38, 10);
      ctx.fill();

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('🔒 https://', 150, 42);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('affyofficial.dev', 270, 42);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('/portfolio', 440, 42);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('LIVE WEB ⚡', width - 200, 42);

      // Web App Navbar
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 70, width, 80);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 150);
      ctx.lineTo(width, 150);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 32px monospace';
      ctx.fillText('AFFY OFFICIAL', 40, 122);
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('BY AFTAB', 300, 122);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('APKs & Software', 540, 118);
      ctx.fillText('Source Code', 720, 118);
      ctx.fillText('About Aftab', 880, 118);
      ctx.fillText('Direct WhatsApp', 1030, 118);

      // Hero Banner on Web
      const heroGrad = ctx.createLinearGradient(40, 170, width - 40, 400);
      heroGrad.addColorStop(0, '#0c1b33');
      heroGrad.addColorStop(0.5, '#0e2448');
      heroGrad.addColorStop(1, '#081021');
      ctx.fillStyle = heroGrad;
      ctx.beginPath();
      ctx.roundRect(40, 170, width - 80, 240, 20);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('⚡ OFFICIAL DIGITAL HUB OF AFTAB (CodeWithAffy)', 70, 215);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 38px sans-serif';
      ctx.fillText('Verified Software & Commercial Source Code', 70, 270);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px sans-serif';
      ctx.fillText('Direct Developer Delivery • 100% Virus-Free • Instant Invoices & Licenses', 70, 310);

      // Action Buttons
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.roundRect(70, 335, 230, 48, 12);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Explore Marketplace ➔', 90, 365);

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(320, 335, 200, 48, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Contact Aftab', 360, 365);

      // Featured Product Cards
      const cards = [
        { title: 'Affy Stream Player Pro', tag: 'Android APK', price: 'FREE / Pro', col: '#10b981' },
        { title: 'AffyPOS Retail Engine', tag: 'Full Source Code', price: 'Commercial', col: '#38bdf8' },
        { title: 'Encrypted Vault Messenger', tag: 'Web & Mobile', price: 'Verified', col: '#a855f7' }
      ];

      cards.forEach((c, i) => {
        const cardX = 40 + i * ((width - 80) / 3);
        const cardW = (width - 120) / 3;
        ctx.fillStyle = '#0e172a';
        ctx.beginPath();
        ctx.roundRect(cardX, 430, cardW, 200, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        ctx.fillStyle = c.col;
        ctx.font = 'bold 16px monospace';
        ctx.fillText(c.tag, cardX + 24, 465);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(c.title, cardX + 24, 505);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText(`Engineered by Aftab`, cardX + 24, 535);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 18px monospace';
        ctx.fillText(c.price, cardX + 24, 590);
      });

    } else {
      // Split Screen Mode
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width / 2, height);
      ctx.fillStyle = '#060911';
      ctx.fillRect(width / 2, 0, width / 2, height);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width / 2, 50);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('💻 Code Runner (Active)', 30, 32);

      for (let i = 0; i < 16; i++) {
        const line = codeLines[i % codeLines.length] || '';
        ctx.fillStyle = i % 2 === 0 ? '#67e8f9' : '#e2e8f0';
        ctx.font = '16px monospace';
        ctx.fillText(line.substring(0, 36), 30, 90 + i * 32);
      }

      ctx.fillStyle = '#111827';
      ctx.fillRect(width / 2, 0, width / 2, 50);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('🌐 affyofficial.dev [LIVE PREVIEW]', width / 2 + 30, 32);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px sans-serif';
      ctx.fillText('AFFY OFFICIAL', width / 2 + 40, 110);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Platform of Aftab', width / 2 + 40, 145);

      ctx.fillStyle = '#0c1b33';
      ctx.beginPath();
      ctx.roundRect(width / 2 + 40, 170, width / 2 - 80, 200, 14);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Digital Solutions Ready', width / 2 + 60, 220);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('Verified APKs • Commercial Source Code', width / 2 + 60, 260);
      ctx.fillText('Direct WhatsApp & Invoicing Support', width / 2 + 60, 290);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 580;

    // 1. Scene, Camera, Transparent WebGL Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true, // TRUE TRANSPARENCY - Blends directly into website background!
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0); // Completely transparent background
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. High Resolution Canvas Texture for Screen
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1280;
    screenCanvas.height = 800;
    screenCanvasRef.current = screenCanvas;
    const ctx = screenCanvas.getContext('2d')!;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    screenTextureRef.current = screenTexture;

    // 3. Ultra-Realistic Materials
    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x141b2a, // Deep Cyber Alloy
      metalness: 0.9,
      roughness: 0.18
    });

    const bezelMaterial = new THREE.MeshStandardMaterial({
      color: 0x05070c,
      metalness: 0.4,
      roughness: 0.1
    });

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false
    });

    // 4. Laptop 3D Group
    const laptopGroup = new THREE.Group();
    laptopGroupRef.current = laptopGroup;
    scene.add(laptopGroup);

    // --- BASE (LOWER CHASSIS) ---
    const baseWidth = 4.2;
    const baseDepth = 2.8;
    const baseHeight = 0.12;

    const baseGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const baseMesh = new THREE.Mesh(baseGeo, chassisMaterial);
    baseMesh.position.set(0, baseHeight / 2, 0);
    laptopGroup.add(baseMesh);

    // Keyboard Well Recess
    const kbWellGeo = new THREE.BoxGeometry(3.6, 0.02, 1.4);
    const kbWellMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.5 });
    const kbWellMesh = new THREE.Mesh(kbWellGeo, kbWellMat);
    kbWellMesh.position.set(0, baseHeight + 0.005, -0.4);
    laptopGroup.add(kbWellMesh);

    // Illuminated Keyboard Keys Canvas Texture
    const kbCanvas = document.createElement('canvas');
    kbCanvas.width = 512;
    kbCanvas.height = 256;
    const kbCtx = kbCanvas.getContext('2d')!;
    kbCtx.fillStyle = '#0c101c';
    kbCtx.fillRect(0, 0, 512, 256);
    kbCtx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    kbCtx.lineWidth = 2;
    const rows = 5;
    const cols = 14;
    const kw = 512 / cols;
    const kh = 256 / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        kbCtx.fillStyle = '#172033';
        kbCtx.beginPath();
        kbCtx.roundRect(c * kw + 2, r * kh + 2, kw - 4, kh - 4, 3);
        kbCtx.fill();
        kbCtx.stroke();
      }
    }
    // Spacebar Key
    kbCtx.fillStyle = '#1e293b';
    kbCtx.fillRect(140, 210, 230, 40);
    kbCtx.strokeRect(140, 210, 230, 40);

    const kbTexture = new THREE.CanvasTexture(kbCanvas);
    const kbMaterial = new THREE.MeshStandardMaterial({
      map: kbTexture,
      roughness: 0.35,
      metalness: 0.3,
      emissive: new THREE.Color(0x00f2fe),
      emissiveIntensity: 0.2
    });

    const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.025, 1.35), kbMaterial);
    kbMesh.position.set(0, baseHeight + 0.02, -0.4);
    laptopGroup.add(kbMesh);

    // Precision Trackpad
    const trackpadMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.01, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x182030, metalness: 0.8, roughness: 0.15 })
    );
    trackpadMesh.position.set(0, baseHeight + 0.005, 0.8);
    laptopGroup.add(trackpadMesh);

    // --- SCREEN LID & HINGE ---
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, baseHeight, -baseDepth / 2 + 0.05);

    // Hinge Pin
    const hingeGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.8, 16);
    hingeGeo.rotateZ(Math.PI / 2);
    const hingeMesh = new THREE.Mesh(hingeGeo, new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 }));
    lidGroup.add(hingeMesh);

    // Screen Lid Back Shell
    const screenWidth = 4.2;
    const screenHeight = 2.65;
    const screenThickness = 0.08;

    const lidBackMesh = new THREE.Mesh(
      new THREE.BoxGeometry(screenWidth, screenHeight, screenThickness),
      chassisMaterial
    );
    lidBackMesh.position.set(0, screenHeight / 2, 0);
    lidGroup.add(lidBackMesh);

    // Glowing Affy Official Logo on Back of Screen
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 256;
    logoCanvas.height = 256;
    const logoCtx = logoCanvas.getContext('2d')!;
    logoCtx.fillStyle = '#000000';
    logoCtx.fillRect(0, 0, 256, 256);
    logoCtx.fillStyle = '#00f2fe';
    logoCtx.font = 'bold 80px monospace';
    logoCtx.textAlign = 'center';
    logoCtx.textBaseline = 'middle';
    logoCtx.shadowColor = '#00f2fe';
    logoCtx.shadowBlur = 20;
    logoCtx.fillText('AFFY', 128, 128);

    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    const logoMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      emissive: new THREE.Color(0x00f2fe),
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), logoMat);
    logoMesh.position.set(0, screenHeight / 2, -screenThickness / 2 - 0.005);
    logoMesh.rotation.y = Math.PI;
    lidGroup.add(logoMesh);

    // Screen Front Bezel
    const bezelMesh = new THREE.Mesh(
      new THREE.BoxGeometry(screenWidth - 0.1, screenHeight - 0.1, 0.02),
      bezelMaterial
    );
    bezelMesh.position.set(0, screenHeight / 2, screenThickness / 2 + 0.005);
    lidGroup.add(bezelMesh);

    // High-Resolution Active Screen Display
    const screenActiveMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(screenWidth - 0.3, screenHeight - 0.35),
      screenMaterial
    );
    screenActiveMesh.position.set(0, screenHeight / 2, screenThickness / 2 + 0.02);
    lidGroup.add(screenActiveMesh);

    // Realistic Open Angle (~108 degrees)
    lidGroup.rotation.x = -Math.PI * 0.12;
    laptopGroup.add(lidGroup);

    // Soft Contact Shadow Plane directly underneath laptop base (NOT a floor box!)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 4.0), shadowMaterial);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.55;
    shadowMeshRef.current = shadowMesh;
    scene.add(shadowMesh);

    // Screen Light Casting Glow on Laptop & Surrounding space
    const screenLight = new THREE.PointLight(0x38bdf8, 2.8, 6);
    screenLight.position.set(0, 1.2, 0.3);
    laptopGroup.add(screenLight);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const purpleRimLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    purpleRimLight.position.set(-4, 3, -3);
    scene.add(purpleRimLight);

    // Initial position & tilt
    laptopGroup.rotation.y = -0.15;
    laptopGroup.rotation.x = 0.08;
    laptopGroup.position.y = -0.2;

    // 5. Interactive Mouse Orbit / Parallax
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      isInteractingRef.current = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMoveWindow = (e: MouseEvent) => {
      // Natural Page Parallax Tilt (laptop turns towards user cursor across the page!)
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normX = (e.clientX - centerX) / (window.innerWidth / 2);
        const normY = (e.clientY - centerY) / (window.innerHeight / 2);
        mouseTargetRef.current = {
          x: Math.max(-1, Math.min(1, normX)),
          y: Math.max(-1, Math.min(1, normY))
        };
      }

      // Direct drag rotation
      if (isDragging && laptopGroupRef.current) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        laptopGroupRef.current.rotation.y += deltaX * 0.008;
        laptopGroupRef.current.rotation.x = Math.max(-0.25, Math.min(0.45, laptopGroupRef.current.rotation.x + deltaY * 0.005));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 2500);
    };

    // Mobile touch
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        isInteractingRef.current = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !laptopGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      laptopGroupRef.current.rotation.y += deltaX * 0.008;
      laptopGroupRef.current.rotation.x = Math.max(-0.25, Math.min(0.45, laptopGroupRef.current.rotation.x + deltaY * 0.005));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 2500);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMoveWindow);
    window.addEventListener('mouseup', onMouseUp);

    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // 6. 60FPS Fluid Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Screen Dynamic Canvas
      drawScreen(ctx, screenCanvas.width, screenCanvas.height, elapsedTime);
      screenTexture.needsUpdate = true;

      // Smooth Parallax Interpolation
      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.05;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.05;

      if (laptopGroupRef.current) {
        // Floating Hover Breathing Motion
        const floatY = Math.sin(elapsedTime * 1.6) * 0.08 - 0.2;
        laptopGroupRef.current.position.y = floatY;

        // Shadow scale breathes with float
        if (shadowMeshRef.current) {
          const shadowScale = 1 - (floatY + 0.2) * 0.4;
          shadowMeshRef.current.scale.set(shadowScale, shadowScale, shadowScale);
        }

        if (!isInteractingRef.current) {
          if (isRotating) {
            laptopGroupRef.current.rotation.y += 0.003;
          }
          // Parallax Tilt based on mouse position
          const targetRotX = 0.08 + mouseCurrentRef.current.y * 0.12;
          laptopGroupRef.current.rotation.x += (targetRotX - laptopGroupRef.current.rotation.x) * 0.05;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 900;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMoveWindow);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      screenTexture.dispose();
    };
  }, []);

  const setCameraPreset = (preset: 'front' | 'angled' | 'top') => {
    setActiveViewPreset(preset);
    if (!cameraRef.current || !laptopGroupRef.current) return;

    if (preset === 'front') {
      cameraRef.current.position.set(0, 2.0, 5.2);
      laptopGroupRef.current.rotation.set(0.08, 0, 0);
    } else if (preset === 'angled') {
      cameraRef.current.position.set(2.8, 2.4, 5.0);
      laptopGroupRef.current.rotation.set(0.06, 0.45, 0);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 3.6, 4.2);
      laptopGroupRef.current.rotation.set(0.35, -0.2, 0);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full overflow-visible select-none ${className}`}>
      {/* 
        NO BOX BORDER, NO VIDEO FRAME. 
        Completely transparent stage that renders the 3D laptop directly onto the website's background!
      */}
      <div
        ref={mountRef}
        className={`w-full ${height} cursor-grab active:cursor-grabbing select-none relative z-10`}
      />

      {/* Floating VIP Interactive Controls (Floating directly on the website) */}
      <div className="relative z-20 -mt-6 sm:-mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4">
        {/* Mode Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090d18]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-950/50">
          <button
            onClick={() => setScreenMode('code')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              screenMode === 'code'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40 scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Live Code Runner</span>
          </button>

          <button
            onClick={() => setScreenMode('web')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              screenMode === 'web'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40 scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>AFFY OFFICIAL Web</span>
          </button>

          <button
            onClick={() => setScreenMode('split')}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              screenMode === 'split'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40 scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dual Split</span>
          </button>
        </div>

        {/* Orbit / View Presets */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/5 text-xs font-mono">
          <button
            onClick={() => setCameraPreset('front')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeViewPreset === 'front' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Front View
          </button>
          <button
            onClick={() => setCameraPreset('angled')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeViewPreset === 'angled' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Isometric
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              isRotating ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle 360 Auto Orbit"
          >
            <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{isRotating ? 'Auto-Orbit' : 'Paused'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
