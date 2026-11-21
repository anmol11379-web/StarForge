import React, { useState } from 'react';
import { Sun, Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onApplyDemoMission?: () => void;
  onOpenStormModal: () => void;
  onOpenAssumptions?: () => void;
  activeStorm: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStormModal,
  activeStorm,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Hazards', href: '#problem' },
    { label: 'Calculator', href: '#calculator' },
    { label: 'Shielding', href: '#shielding-trade' },
    { label: 'Aditya-L1', href: '#aditya-l1' },
    { label: 'Science', href: '#method' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        
        {/* Brand / Logo - Clean, Transparent with Smooth Zero-G Floating Movement */}
        <a href="#top" className="flex items-center gap-2.5 font-medium tracking-tight group shrink-0">
          <img
            src="/images/logo.png?v=3"
            alt="AstroShield Logo"
            className="size-8 object-contain animate-logo-float transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.45)] group-hover:drop-shadow-[0_0_14px_rgba(56,189,248,0.7)]"
          />
          <span className="font-heading text-base font-semibold text-foreground tracking-tight transition-colors group-hover:text-sky-400">
            AstroShield
          </span>
        </a>

        {/* Center Nav Links - Short, Clean, Spacious */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-muted-foreground font-sans">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-foreground hover:text-accent text-[13px] tracking-wide"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Controls - Only the Necessary Elements */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Solar Storm Simulation Trigger */}
          <button
            type="button"
            onClick={onOpenStormModal}
            className={`flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors ${
              activeStorm
                ? 'bg-destructive/20 border border-destructive text-destructive animate-pulse'
                : 'border border-[#38bdf8]/40 bg-[#0c1e38] hover:bg-[#132d54] text-[#f8fafc] hover:border-[#38bdf8] transition-colors shadow-[0_0_12px_rgba(56,189,248,0.15)]'
            }`}
            title="Simulate a Solar Particle Event (SPE) storm"
          >
            <Sun className="size-3 text-sky-400 shrink-0" />
            <span className="hidden sm:inline">
              {activeStorm ? 'Storm Active!' : 'Simulate Storm'}
            </span>
            <span className="sm:hidden">
              {activeStorm ? 'Alert!' : 'Storm'}
            </span>
          </button>

          {/* Primary Action Button */}
          <a
            href="#calculator"
            className="rounded-md bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-3 sm:px-3.5 py-1.5 text-xs transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)] shrink-0"
          >
            Calculate
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/80 bg-background/95 backdrop-blur-lg px-6 py-4 shadow-xl">
          <ul className="flex flex-col gap-3 font-sans text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-muted-foreground hover:text-foreground border-b border-border/40"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="size-4 text-muted-foreground/60" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};
