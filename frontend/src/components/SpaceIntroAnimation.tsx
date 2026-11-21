import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SpaceIntroAnimationProps {
  onComplete: () => void;
}

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  size: number;
  color: string;
}

export const SpaceIntroAnimation: React.FC<SpaceIntroAnimationProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING DEEP-SPACE TELEMETRY...');
  const [isWarping, setIsWarping] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Smooth fade out handler
  const handleFadeOutAndComplete = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 650);
  }, [onComplete]);

  // Starfield canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const numStars = 320;
    const stars: Star[] = [];
    const starColors = ['#ffffff', '#f8fafc', '#e2e8f0', '#38bdf8', '#7dd3fc', '#818cf8'];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: width,
        size: Math.random() * 1.5 + 0.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    let baseSpeed = 4.2;

    const render = () => {
      // Create trailing motion blur when warping
      ctx.fillStyle = isWarping ? 'rgba(3, 7, 18, 0.35)' : 'rgba(3, 7, 18, 0.9)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const currentSpeed = isWarping ? baseSpeed * 12 : baseSpeed;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.pz = star.z;
        star.z -= currentSpeed;

        if (star.z <= 0) {
          star.z = width;
          star.pz = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 280 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const prevK = 280 / star.pz;
          const ppx = star.x * prevK + cx;
          const ppy = star.y * prevK + cy;

          const size = Math.max(0.6, (1 - star.z / width) * star.size * (isWarping ? 2.5 : 1.8));
          const alpha = Math.min(1, Math.max(0.1, (1 - star.z / width) * 1.3));

          ctx.beginPath();
          if (isWarping) {
            // Draw warp streaks
            ctx.strokeStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = size * 1.2;
            ctx.moveTo(ppx, ppy);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            // Draw twinkling stars
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWarping]);

  // Loading progress and telemetry sequencing - Fast & responsive
  useEffect(() => {
    const totalDuration = 1100; // 1.1s fast loading
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(currentPct);

      if (currentPct > 20 && currentPct <= 55) {
        setStatusText('CONNECTING TO ISRO ADITYA-L1 & NOAA SATELLITES...');
      } else if (currentPct > 55 && currentPct <= 85) {
        setStatusText('CALIBRATING SPACECRAFT SHIELDING MODELS...');
      } else if (currentPct > 85) {
        setStatusText('MISSION CONSOLE READY · ENTERING ORBIT');
        setIsWarping(true);
      }

      if (currentPct >= 100) {
        clearInterval(interval);
        handleFadeOutAndComplete();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [handleFadeOutAndComplete]);

  return (
    <div
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isFadingOut ? 'scale(1.03)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712] text-foreground select-none overflow-hidden"
    >
      {/* 3D Deep Space Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Bar Branding */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5 font-mono text-xs text-sky-400 font-semibold tracking-wider">
          <img src="/images/logo.png?v=3" alt="AstroShield Logo" className="size-6 object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
          <span>ASTROSHIELD · MISSION CONSOLE</span>
        </div>
        <button
          type="button"
          onClick={handleFadeOutAndComplete}
          className="rounded border border-sky-400/40 bg-[#0c1e38]/80 hover:bg-[#0c1e38] px-3 py-1.5 font-mono text-[11px] text-slate-200 hover:text-sky-400 hover:border-sky-400 transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)]"
        >
          Skip Intro ↵
        </button>
      </div>

      {/* Center Intro Card - Matching User Reference Design */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Main Title - Clean without emoji */}
          <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(56,189,248,0.35)]">
            AstroShield
          </h1>

          {/* Subtitle */}
          <p className="mt-3 font-sans text-sm sm:text-base text-slate-300 font-normal tracking-wide max-w-md">
            Explainable Crew Radiation Protection for Deep-Space Missions
          </p>

          {/* Telemetry Status Line */}
          <div className="mt-8 flex items-center gap-2 font-mono text-xs tracking-wider text-sky-400">
            <span className="size-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="truncate">{statusText}</span>
          </div>

          {/* Progress Bar Container */}
          <div className="mt-4 w-64 sm:w-80 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/60 p-[1px]">
            <motion.div
              className="h-full bg-sky-400 rounded-full shadow-[0_0_12px_#38bdf8]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="mt-2 font-mono text-[11px] text-slate-400">
            {progress}% Telemetry Synchronized
          </div>
        </motion.div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-6 flex flex-col items-center text-slate-500 font-mono text-[10px] tracking-widest uppercase">
        <span>ASTRA 2026 · Domain 5 Deep Space</span>
        <ChevronDown className="size-3.5 mt-1 text-slate-400 animate-bounce" />
      </div>
    </div>
  );
};
