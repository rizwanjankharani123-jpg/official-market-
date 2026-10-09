import React, { useState, useRef, useEffect } from 'react';
import { AFTAB_PROFILE_IMAGE_URL, AFTAB_LOCAL_FALLBACK_IMAGE } from '../common/AftabAvatar';
import { ShieldCheck, Sparkles, Terminal, Eye, RotateCw, ExternalLink, MessageSquare, Mail, Award, Zap } from 'lucide-react';

interface Aftab3DPhotoPortalProps {
  className?: string;
  showControls?: boolean;
}

export const Aftab3DPhotoPortal: React.FC<Aftab3DPhotoPortalProps> = ({
  className = '',
  showControls = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hologramMode, setHologramMode] = useState(true);
  const [imgSrc, setImgSrc] = useState(AFTAB_PROFILE_IMAGE_URL);
  const [scanLaserPos, setScanLaserPos] = useState(0);

  // Hologram Laser Scanner Animation
  useEffect(() => {
    let animId: number;
    let start = performance.now();

    const loop = (time: number) => {
      const elapsed = (time - start) / 1000;
      // Oscillate 0% to 100%
      const pos = (Math.sin(elapsed * 2) * 0.5 + 0.5) * 100;
      setScanLaserPos(pos);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 3D Parallax Tilt Physics on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angle (max 18 degrees)
    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className={`relative perspective-1000 ${className}`}>
      {/* 3D Floating Cyber Frame */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-3xl p-3 bg-gradient-to-br from-[#0c1322] via-[#080d17] to-[#04060c] border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 transition-transform duration-150 ease-out select-none cursor-pointer group"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Dynamic Specular Glass Reflection Layer */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 - rotateX * 2}%, rgba(56, 189, 248, 0.35) 0%, transparent 65%)`
          }}
        />

        {/* Ambient Corner Cyber Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

        {/* Main Photo Container with 3D Depth Elevation */}
        <div
          className="relative aspect-[4/4.8] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Aftab's Official Photo */}
          <img
            src={imgSrc}
            alt="Aftab — Web Developer & Software Developer"
            onError={() => {
              if (imgSrc !== AFTAB_LOCAL_FALLBACK_IMAGE) {
                setImgSrc(AFTAB_LOCAL_FALLBACK_IMAGE);
              }
            }}
            className={`w-full h-full object-cover object-top transition-all duration-500 ${
              hologramMode ? 'contrast-110 saturate-110' : ''
            }`}
            loading="eager"
            crossOrigin="anonymous"
          />

          {/* Hologram Grid & Scanline FX Overlay */}
          {hologramMode && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Scanlines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 242, 254, 0.4) 4px)'
                }}
              />

              {/* Holographic Vertical Laser Scanner */}
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#00f2fe]"
                style={{ top: `${scanLaserPos}%` }}
              />
              <div
                className="absolute inset-x-0 h-12 bg-gradient-to-b from-cyan-400/15 to-transparent pointer-events-none"
                style={{ top: `${scanLaserPos}%` }}
              />

              {/* Cyber Vignette & Color Grading */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d17] via-transparent to-black/30" />
            </div>
          )}

          {/* Top Floating Badge: Verified Identity */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-lg"
            style={{ transform: 'translateZ(45px)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>VERIFIED ARCHITECT</span>
          </div>

          {/* Top Right Live Telemetry */}
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold flex items-center gap-1"
            style={{ transform: 'translateZ(45px)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>ONLINE</span>
          </div>

          {/* Bottom Holographic Profile Info Card */}
          <div
            className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 text-left shadow-2xl"
            style={{ transform: 'translateZ(50px)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white font-mono flex items-center gap-1.5">
                  <span>Aftab</span>
                  <span className="text-xs text-cyan-400 font-normal">(@CodeWithAffy)</span>
                </p>
                <p className="text-[11px] text-cyan-300 font-mono">
                  Web Developer & Software Developer
                </p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>PLATFORM: AFFY OFFICIAL</span>
              <span className="text-emerald-400 font-bold">100% SECURE</span>
            </div>
          </div>
        </div>

        {/* 3D Hologram Toggle Controls */}
        {showControls && (
          <div
            className="mt-3 flex items-center justify-between gap-2 px-1 text-xs font-mono"
            style={{ transform: 'translateZ(20px)' }}
          >
            <button
              onClick={() => setHologramMode(!hologramMode)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                hologramMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-md shadow-cyan-950/40'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{hologramMode ? '3D Hologram: ON' : '3D Hologram: OFF'}</span>
            </button>

            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-cyan-400" />
              Hover to Tilt 3D
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
