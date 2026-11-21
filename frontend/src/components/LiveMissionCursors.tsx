import React from 'react';
import { motion } from 'framer-motion';

interface CursorConfig {
  id: string;
  name: string;
  color: string;
  path: {
    x: (number | string)[];
    y: (number | string)[];
    scale?: number[];
  };
  duration: number;
  delay?: number;
}

export const LiveMissionCursors: React.FC = () => {
  // Space HUD telemetry cursor palette:
  // #38bdf8 (Electric Orbital Cyan / Flight Director)
  // #2dd4bf (Aurora Teal / Radiation Shield Engineer)
  // #818cf8 (Celestial Violet / ISRO Aditya-L1 Specialist)
  const cursors: CursorConfig[] = [
    {
      id: 'flight-dir',
      name: 'FLIGHT DIRECTOR',
      color: '#38bdf8',
      path: {
        x: ['68%', '60%', '74%', '64%', '68%'],
        y: ['20%', '32%', '25%', '38%', '20%'],
        scale: [1, 0.95, 1.05, 1, 1],
      },
      duration: 14,
      delay: 0,
    },
    {
      id: 'rad-safety',
      name: 'RADIATION SHIELD',
      color: '#2dd4bf',
      path: {
        x: ['8%', '22%', '14%', '26%', '8%'],
        y: ['42%', '48%', '60%', '45%', '42%'],
        scale: [1, 1.05, 0.95, 1, 1],
      },
      duration: 16,
      delay: 1.5,
    },
    {
      id: 'isro-sentinel',
      name: 'ISRO ADITYA-L1',
      color: '#818cf8',
      path: {
        x: ['58%', '72%', '65%', '80%', '58%'],
        y: ['68%', '75%', '62%', '72%', '68%'],
        scale: [1, 0.92, 1, 1.04, 1],
      },
      duration: 18,
      delay: 3,
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden hidden sm:block"
    >
      {cursors.map((c) => (
        <motion.div
          key={c.id}
          initial={{
            left: c.path.x[0],
            top: c.path.y[0],
            opacity: 0,
          }}
          animate={{
            left: c.path.x,
            top: c.path.y,
            scale: c.path.scale || [1, 1, 1, 1, 1],
            opacity: [0, 0.95, 0.95, 0.95, 0.95],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay || 0,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute flex items-start gap-1.5 select-none will-change-transform"
          style={{ position: 'absolute' }}
        >
          {/* Angled Cursor Pointer SVG */}
          <svg
            width="18"
            height="20"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] shrink-0"
          >
            <path
              d="M1 1L6.5 16.5L9.5 9.5L15.5 6.5L1 1Z"
              fill={c.color}
              stroke="#030712"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          {/* User Tag Label Badge matching Space Telemetry HUD */}
          <div
            className="rounded px-2.5 py-0.5 text-[10.5px] font-mono font-semibold tracking-wider text-slate-100 bg-[#0c1e38] border shadow-[0_0_12px_rgba(56,189,248,0.25)] uppercase whitespace-nowrap mt-2.5 flex items-center gap-1.5"
            style={{ borderColor: c.color }}
          >
            <span className="size-1.5 rounded-full shrink-0 animate-blink" style={{ backgroundColor: c.color }} />
            <span>{c.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
