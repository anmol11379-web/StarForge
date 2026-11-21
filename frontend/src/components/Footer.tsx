import React from 'react';

export const Footer: React.FC = () => {
  return (
    <>
      {/* Pre-footer Callout Banner */}
      <div className="border-b border-border/60 py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Keeping Space Explorers Safe
            </p>
            <h2 className="mt-4 text-balance text-3xl font-medium tracking-tight md:text-5xl text-foreground">
              Plan the spaceship shields first. Keep the crew safe forever.
            </h2>
          </div>
          <a
            href="#calculator"
            className="rounded-md bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-5 py-3 text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.35)]"
          >
            Test Your Mission Now
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="py-12 bg-background">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
            <img src="/images/logo.png?v=3" alt="AstroShield Logo" className="size-6 object-contain animate-logo-float drop-shadow-[0_0_6px_rgba(56,189,248,0.35)]" />
            <span className="font-medium text-foreground">AstroShield</span>
            <span>·</span>
            <span>Built for ASTRA 2026 (Moon, Mars &amp; Deep-Space Exploration)</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
            <span>NOAA Satellites</span>
            <span>·</span>
            <span>NASA Curiosity Mars</span>
            <span>·</span>
            <span>Moon Chang'e-4</span>
            <span>·</span>
            <span>ISRO Aditya-L1</span>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Space Radiation Calculator for Curious Explorers
          </p>
        </div>
      </footer>
    </>
  );
};
