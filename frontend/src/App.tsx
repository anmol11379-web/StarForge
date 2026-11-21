import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  Orbit,
  Zap,
  Activity,
  Calculator,
  Compass,
  GraduationCap,
  Microscope,
  FileText,
  Sparkles,
  Quote,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { SpaceWeatherPanel } from './components/SpaceWeatherPanel';
import { MissionBuilder, SolarCycleCard } from './components/MissionBuilder';
import { DoseTimeline } from './components/DoseTimeline';
import { RiskSummary } from './components/RiskSummary';
import { ShieldingComparison } from './components/ShieldingComparison';
import { AdityaL1Panel } from './components/AdityaL1Panel';
import { StormScenarioModal } from './components/StormScenarioModal';
import { AssumptionsDrawer } from './components/AssumptionsDrawer';
import { Footer } from './components/Footer';
import { LiveMissionCursors } from './components/LiveMissionCursors';
import { GlitchText } from './components/GlitchText';
import { SpaceIntroAnimation } from './components/SpaceIntroAnimation';

import {
  MissionEstimateRequest,
  MissionEstimateResponse,
  StormScenarioResponse,
  SpaceWeatherTelemetry,
} from './types';
import { fetchSpaceWeather, estimateMissionDose } from './services/api';

export const App: React.FC = () => {
  // Smooth scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Space Weather State
  const [weather, setWeather] = useState<SpaceWeatherTelemetry | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Mission Config State (Defaults to 180-day Mars transit)
  const [config, setConfig] = useState<MissionEstimateRequest>({
    destination: 'mars_transit',
    duration_days: 180,
    crew_size: 4,
    shielding_areal_density: 20.0,
    shielding_material: 'aluminium',
    solar_cycle_phase: 'solar_moderate',
  });

  // Dose Calculation Engine State
  const [estimate, setEstimate] = useState<MissionEstimateResponse | null>(null);
  const [calculatingDose, setCalculatingDose] = useState<boolean>(false);

  // Deep Space Starfield Intro Animation State
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Storm Simulation State
  const [stormScenario, setStormScenario] = useState<StormScenarioResponse | null>(null);
  const [isStormModalOpen, setIsStormModalOpen] = useState<boolean>(false);

  // Assumptions Drawer State
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState<boolean>(false);

  // Load Space Weather
  const loadWeather = useCallback(async () => {
    setLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await fetchSpaceWeather();
      setWeather(data);
    } catch (err: any) {
      console.warn('Weather fetch fallback:', err);
      setWeatherError(err?.message || 'Network timeout');
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // Smooth scroll handler for all internal anchor links (#calculator, #problem, etc.)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          window.history.pushState(null, '', href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Recalculate Dose on Config Change
  useEffect(() => {
    let cancelled = false;
    setCalculatingDose(true);

    const timer = setTimeout(async () => {
      try {
        const result = await estimateMissionDose(config);
        if (!cancelled) {
          setEstimate(result);
          if (stormScenario && stormScenario.duration_days !== config.duration_days) {
            setStormScenario(null);
          }
        }
      } catch (err) {
        console.error('Failed to estimate dose:', err);
      } finally {
        if (!cancelled) setCalculatingDose(false);
      }
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [config]);

  // One-Click Demo Mission Preset
  const handleApplyDemo = () => {
    setConfig({
      destination: 'mars_transit',
      duration_days: 180,
      crew_size: 4,
      shielding_areal_density: 20.0,
      shielding_material: 'polyethylene',
      solar_cycle_phase: 'solar_moderate',
    });
    setStormScenario(null);
  };

  const missionPresets = [
    {
      id: 'artemis_moon',
      icon: '🌙',
      title: 'Artemis Moon Base',
      days: '14d',
      config: {
        destination: 'lunar_surface',
        duration_days: 14,
        crew_size: 4,
        shielding_areal_density: 20.0,
        shielding_material: 'aluminium',
        solar_cycle_phase: 'solar_moderate',
      },
    },
    {
      id: 'mars_transit',
      icon: '🚀',
      title: 'Mars Deep Transit',
      days: '180d',
      config: {
        destination: 'mars_transit',
        duration_days: 180,
        crew_size: 4,
        shielding_areal_density: 20.0,
        shielding_material: 'polyethylene',
        solar_cycle_phase: 'solar_moderate',
      },
    },
    {
      id: 'mars_surface',
      icon: '🔴',
      title: 'Mars Surface Base',
      days: '500d',
      config: {
        destination: 'mars_surface',
        duration_days: 500,
        crew_size: 6,
        shielding_areal_density: 50.0,
        shielding_material: 'regolith',
        solar_cycle_phase: 'solar_min',
      },
    },
    {
      id: 'lunar_orbit',
      icon: '🛰️',
      title: 'Gateway Station',
      days: '30d',
      config: {
        destination: 'lunar_orbit',
        duration_days: 30,
        crew_size: 4,
        shielding_areal_density: 20.0,
        shielding_material: 'water',
        solar_cycle_phase: 'solar_moderate',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Deep Space Starfield Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <SpaceIntroAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-[2px] bg-sky-400 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Sticky Header */}
      <Navbar
        onApplyDemoMission={handleApplyDemo}
        onOpenStormModal={() => setIsStormModalOpen(true)}
        onOpenAssumptions={() => setIsAssumptionsOpen(true)}
        activeStorm={!!stormScenario}
      />

      <main>
        {/* ========================================================= */}
        {/* HERO SECTION (#top)                                       */}
        {/* ========================================================= */}
        <section id="top" className="relative overflow-hidden border-b border-border/60">
          {/* Exact Hero Spacecraft Background Image - Smooth Zero-G Drift */}
          <img
            alt="Deep space spacecraft"
            decoding="async"
            className="object-cover object-right opacity-45 absolute inset-0 w-full h-full pointer-events-none select-none animate-space-drift"
            style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
            src="/images/hero-spacecraft.png?v=2"
          />

          {/* Floating Collaborative Space Mission Cursors */}
          <LiveMissionCursors />

          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-24 md:pt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold"
              >
                Space Safety For Astronauts
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-balance text-4xl font-normal leading-tight tracking-tight md:text-6xl text-foreground"
              >
                <GlitchText text="How safe are our astronauts in deep space?" />
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
              >
                Outside Earth's cozy atmosphere, invisible space rays fly everywhere! AstroShield checks live space weather, counts your mission days, and tests spaceship armor to make sure our brave space explorers stay safe and sound.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <a
                  href="#calculator"
                  className="rounded-md bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-5 py-3 text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                >
                  Try the Mission Calculator
                </a>
                <a
                  href="#how"
                  className="rounded-md border border-[#38bdf8]/40 bg-[#0c1e38] hover:bg-[#132d54] px-5 py-3 text-sm font-medium transition-all text-[#f8fafc] hover:border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                >
                  See How It Works
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* THE PROBLEM SECTION (#problem)                            */}
        {/* ========================================================= */}
        <section id="problem" className="border-b border-border/60 py-24 scroll-mt-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-12 md:grid-cols-[1fr_1.4fr]"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
                  <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 font-semibold">
                    Step 01 · Deep-Space Hazards
                  </span>
                </div>
                <h2 className="mt-4 text-balance text-3xl font-medium tracking-tight md:text-4xl text-foreground">
                  Two invisible hazards in space. How do we keep astronauts safe?
                </h2>
                <p className="mt-5 leading-relaxed text-muted-foreground text-sm">
                  When astronauts travel to the Moon or Mars, they get hit by harmful radiation from deep space. Out in space, Earth's magnetic field no longer protects them! It comes from two distinct sources:
                </p>
                <div className="mt-4 rounded-md border border-accent/30 bg-accent/5 p-3 text-xs leading-relaxed text-accent/90">
                  <strong className="text-foreground block mb-1 font-mono uppercase tracking-wider text-[11px]">
                    Earth's Missing Shield:
                  </strong>
                  On Earth, our atmosphere and geomagnetic bubble act like a giant roof. Once astronauts leave low-Earth orbit, they are completely exposed to open space weather.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* GCR Card - Structured Telemetry Card */}
                <div className="flex flex-col rounded-lg border border-border bg-card p-5 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                        <Orbit className="size-4" />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-sky-400 font-semibold tracking-wider uppercase">
                          Hazard Type 01
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-foreground">
                          Galactic Cosmic Rays (GCR)
                        </h3>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-sky-400/10 border border-sky-400/30 text-sky-400 font-semibold">
                      GCR
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Super-fast atomic particles shooting from exploded ancient stars across the galaxy. They fly continuously like invisible cosmic rain, slowly accumulating inside astronauts every single day in space.
                  </p>

                  {/* Structured Specifications Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="rounded border border-border/80 bg-secondary/40 p-2.5">
                      <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Dose Exposure</span>
                      <span className="text-sky-400 font-bold text-sm">~1.8 mSv</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">every single day</span>
                    </div>

                    <div className="rounded border border-border/80 bg-secondary/40 p-2.5">
                      <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Frequency</span>
                      <span className="text-foreground font-bold text-sm">Non-Stop</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">constant background</span>
                    </div>

                    <div className="rounded border border-border/80 bg-secondary/40 p-2.5">
                      <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Origin</span>
                      <span className="text-foreground font-semibold">Deep Galaxy</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">Supernovae remnants</span>
                    </div>

                    <div className="rounded border border-border/80 bg-secondary/40 p-2.5">
                      <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Best Armor</span>
                      <span className="text-accent font-semibold">HDPE Plastic</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">Hydrogen-rich shield</span>
                    </div>
                  </div>

                  {/* Operational Takeaway */}
                  <div className="p-2.5 rounded border border-sky-400/20 bg-sky-400/5 text-[11px] text-slate-300 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-sky-400 shrink-0" />
                    <span><strong>Mission Rule:</strong> Minimizing transit days is key to keeping lifetime GCR dose within NASA limits.</span>
                  </div>
                </div>

                {/* SPE Card - Structured Telemetry Card */}
                <div className="flex flex-col rounded-lg border border-border bg-card p-5 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded bg-rose-400/10 border border-rose-400/30 flex items-center justify-center text-rose-400">
                        <Zap className="size-4" />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-rose-400 font-semibold tracking-wider uppercase">
                          Hazard Type 02
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-foreground">
                          Solar Particle Events (SPE)
                        </h3>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-rose-400/10 border border-rose-400/30 text-rose-400 font-semibold">
                      SPE
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Sudden explosive coronal bursts from the Sun! While rare, these storms spray billions of high-energy protons that can cause acute radiation sickness within hours without an onboard bunker.
                  </p>

                  {/* Structured Specifications Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="rounded border border-border/80 bg-secondary/40 p-2.5">
                      <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Storm Intensity</span>
                      <span className="text-rose-400 font-bold text-sm">100+ mSv</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">in just 24–48 hours</span>
                    </div>

                    <div className="rounded border border-border/80 bg-secondary/40 p-2.5">
                      <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Frequency</span>
                      <span className="text-foreground font-bold text-sm">Unpredictable</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">peaks at solar max</span>
                    </div>

                    <div className="rounded border border-border/80 bg-secondary/40 p-2.5">
                      <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Origin</span>
                      <span className="text-foreground font-semibold">The Sun</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">Coronal Mass Ejections</span>
                    </div>

                    <div className="rounded border border-border/80 bg-secondary/40 p-2.5">
                      <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Best Armor</span>
                      <span className="text-rose-300 font-semibold">Storm Shelter</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">Heavy 45+ g/cm² core</span>
                    </div>
                  </div>

                  {/* Operational Takeaway */}
                  <div className="p-2.5 rounded border border-rose-400/20 bg-rose-400/5 text-[11px] text-slate-300 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span><strong>Mission Rule:</strong> Requires early-warning solar radar (Aditya-L1) + crew storm shelter retreat.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* THE MISSING GAP & OUR SOLUTION */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-14 space-y-6"
            >
              {/* Mission Statement Banner - Friendly for First-Time Visitors */}
              <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-card p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Quote className="size-3" />
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                        New Here? · What AstroShield Does
                      </span>
                    </div>
                    <p className="font-heading text-xl sm:text-2xl font-medium text-foreground tracking-tight leading-snug">
                      “We help keep astronauts safe from space radiation by showing how much they'll receive, when it's safest to fly, and how to shield their spaceship.”
                    </p>
                  </div>
                  <a
                    href="#calculator"
                    className="shrink-0 inline-flex items-center gap-2 rounded-md bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-4 py-2.5 text-xs transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)]"
                  >
                    <span>Try the Calculator</span>
                    <Sparkles className="size-3.5" />
                  </a>
                </div>
              </div>

              {/* The 3 Core Questions Explained Simply */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* Question 1 */}
                <div className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                      <span className="text-primary font-semibold uppercase tracking-wider">01 · Total Exposure</span>
                      <ShieldCheck className="size-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      How much radiation will the astronauts get?
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      <strong className="text-accent font-semibold block mb-0.5">How AstroShield helps:</strong>
                      Pick your destination (Moon or Mars) and trip length. We calculate the exact radiation dose your crew will absorb, and compare it against official NASA safety limits so you know if they stay in the green.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-accent flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-accent" />
                    <span>Real data from NASA Curiosity &amp; Moon landers</span>
                  </div>
                </div>

                {/* Question 2 */}
                <div className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between hover:border-accent/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                      <span className="text-accent font-semibold uppercase tracking-wider">02 · Flight Timing</span>
                      <Calendar className="size-4 text-accent" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      When is the safest time to fly?
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      <strong className="text-accent font-semibold block mb-0.5">How AstroShield helps:</strong>
                      The Sun has calm years and stormy years on an 11-year cycle. We connect to live space satellites in real-time, pointing out the quietest, safest windows to launch.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-accent flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-accent" />
                    <span>Live satellites from NOAA &amp; India's Aditya-L1</span>
                  </div>
                </div>

                {/* Question 3 */}
                <div className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between hover:border-destructive/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                      <span className="text-destructive font-semibold uppercase tracking-wider">03 · Spaceship Armor</span>
                      <Layers className="size-4 text-destructive" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      How thick should the storm shelter be?
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      <strong className="text-accent font-semibold block mb-0.5">How AstroShield helps:</strong>
                      If a sudden solar storm strikes, astronauts must hide in a bunker. Test materials like special plastic, water, Moon soil, or metal to see how much thickness is needed to block the blast.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-accent flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-accent" />
                    <span>Blocks up to 90%+ of solar storm rays</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* DOSE CALCULATOR SECTION (#calculator)                     */}
        {/* ========================================================= */}
        <section id="calculator" className="border-b border-border/60 py-24 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
                <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 font-semibold">
                  Step 02 · Interactive Mission Planner
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">Astronaut Radiation Safety</span>
              </div>
              <h2 className="mt-2 max-w-2xl text-balance text-3xl font-medium tracking-tight md:text-4xl text-foreground">
                Tune your mission. Watch the radiation change!
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                Pick your travel destination, change spaceship armor, and see if your astronaut crew stays safe under NASA's official limits. Every calculation uses real space data from NASA's Mars rover and Moon landers.
              </p>
            </motion.div>

            {/* Live Space Weather Telemetry Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8"
            >
              <SpaceWeatherPanel
                weather={weather}
                loading={loadingWeather}
                error={weatherError}
                onRefresh={loadWeather}
              />
            </motion.div>

            {/* Quick Mission Presets Selector Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 p-3 rounded-lg border border-border bg-card/60 backdrop-blur flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <Sparkles className="size-4 text-accent" />
                <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
                  Preset Mission Flight Plans:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {missionPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setConfig(preset.config);
                      setStormScenario(null);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono transition-all ${
                      config.destination === preset.config.destination &&
                      config.duration_days === preset.config.duration_days &&
                      config.shielding_material === preset.config.shielding_material
                        ? 'border-[#38bdf8] bg-[#0c1e38] text-[#f8fafc] font-semibold ring-1 ring-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                        : 'border-border bg-card/60 hover:bg-[#0c1e38]/50 text-muted-foreground hover:text-[#f8fafc] hover:border-[#38bdf8]/40'
                    }`}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-secondary text-[10px] text-muted-foreground font-sans">
                      {preset.days}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 3-Column Mission Control Console */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start"
            >
              {/* Column 1: Flight Parameters & Spacecraft Armor (Steps 01 & 02) */}
              <div className="flex flex-col">
                <MissionBuilder
                  config={config}
                  onChange={setConfig}
                  loading={calculatingDose}
                  showStep3={false}
                />
              </div>

              {/* Column 2: Mission Buildup Timeline & Step 03 Sun Activity Cycle (Fills empty space beside Step 2) */}
              <div className="flex flex-col gap-6 lg:col-span-2 xl:col-span-1">
                <DoseTimeline
                  estimate={estimate}
                  stormScenario={stormScenario}
                  loading={calculatingDose && !estimate}
                />
                <SolarCycleCard
                  config={config}
                  onChange={setConfig}
                />
              </div>

              {/* Column 3: Astronaut Dose, Safety Limits & Storm Simulator (row 1 col 2 on lg, col 3 on xl) */}
              <div className="flex flex-col lg:row-start-1 lg:col-start-2 xl:row-start-auto xl:col-start-auto">
                <RiskSummary
                  estimate={estimate}
                  stormScenario={stormScenario}
                  onClearStorm={() => setStormScenario(null)}
                  onOpenStormModal={() => setIsStormModalOpen(true)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SHIELDING COMPARISON SECTION (#shielding-trade)           */}
        {/* ========================================================= */}
        <section id="shielding-trade" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <ShieldingComparison />
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* ADITYA-L1 SECTION (#aditya-l1)                            */}
        {/* ========================================================= */}
        <section id="aditya-l1" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <AdityaL1Panel />
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* HOW IT WORKS SECTION (#how)                               */}
        {/* ========================================================= */}
        <section id="how" className="border-b border-border/60 py-24 scroll-mt-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
                <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 font-semibold">
                  Step 05 · How It Works
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">Simple 3-Step Process</span>
              </div>
              <h2 className="mt-2 max-w-2xl text-balance text-3xl font-medium tracking-tight md:text-4xl text-foreground">
                How AstroShield works in 3 simple steps.
              </h2>
            </motion.div>

            {/* 3 Step Cards */}
            <motion.ol
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3"
            >
              <motion.li whileHover={{ y: -2 }} className="flex flex-col bg-card p-6 transition-colors hover:bg-secondary/30">
                <div className="flex items-center justify-between">
                  <Activity className="size-5 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground">01</span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-foreground">Listen to live space satellites</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We check in with real space satellites every 5 minutes to see how many energetic protons are shooting from the Sun right now.
                </p>
              </motion.li>

              <motion.li whileHover={{ y: -2 }} className="flex flex-col bg-card p-6 transition-colors hover:bg-secondary/30">
                <div className="flex items-center justify-between">
                  <Calculator className="size-5 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground">02</span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-foreground">Calculate both space ray hazards</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We add up the slow-and-steady background rays from distant stars, plus any surprise solar storms that strike your spacecraft.
                </p>
              </motion.li>

              <motion.li whileHover={{ y: -2 }} className="flex flex-col bg-card p-6 transition-colors hover:bg-secondary/30">
                <div className="flex items-center justify-between">
                  <FileText className="size-5 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground">03</span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-foreground">Check astronaut health score</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We compare the total dose against NASA's strict safety standards and show you how to build better shields so your crew stays safe!
                </p>
              </motion.li>
            </motion.ol>

            {/* Built for Users Cards */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-16"
            >
              <h3 className="text-lg font-medium text-foreground mb-6">
                Built for curious minds exploring the cosmos.
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <motion.div whileHover={{ y: -3 }} className="rounded-lg border border-border bg-card p-6 transition-all hover:border-border/90 hover:shadow-lg hover:shadow-primary/5">
                  <Compass className="size-5 text-accent mb-4" />
                  <h4 className="font-medium text-foreground text-sm">Future Mission Planners</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Design real Mars spaceships, test bunker thickness, and keep astronaut crews safe on multi-year journeys.
                  </p>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} className="rounded-lg border border-border bg-card p-6 transition-all hover:border-border/90 hover:shadow-lg hover:shadow-primary/5">
                  <GraduationCap className="size-5 text-accent mb-4" />
                  <h4 className="font-medium text-foreground text-sm">Students &amp; Kids</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Build super-cool intuition for how solar weather, spaceship armor, and travel days affect human life in outer space!
                  </p>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} className="rounded-lg border border-border bg-card p-6 transition-all hover:border-border/90 hover:shadow-lg hover:shadow-primary/5">
                  <Microscope className="size-5 text-accent mb-4" />
                  <h4 className="font-medium text-foreground text-sm">Space Scientists</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Verify mission predictions against real published measurements from NASA Curiosity, Chang'e-4, and ISRO Aditya-L1.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* METHODOLOGY SECTION (#method)                             */}
        {/* ========================================================= */}
        <section id="method" className="border-b border-border/60 py-24 scroll-mt-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
                <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 font-semibold">
                  Step 06 · Real Space Science
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">Calibrated by Space Missions</span>
              </div>
              <h2 className="mt-2 text-balance text-3xl font-medium tracking-tight md:text-4xl text-foreground">
                Simple on purpose. Honest about physics.
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                We calculate total radiation dose by adding up everyday deep-space rays (slow and steady) plus any surprise solar storms that hit your spaceship bunker.
              </p>

              {/* Formula Block */}
              <div className="mt-8 rounded-lg border border-border bg-card p-5 font-mono text-xs leading-relaxed">
                <p className="text-muted-foreground"># Plain-English math calculation:</p>
                <p className="text-primary mt-1">Everyday Space Rays = Daily Radiation × Sun Activity × Spaceship Shielding × Days</p>
                <p className="text-accent mt-1">Solar Storm Blast = Storm Power × Emergency Bunker Protection</p>
                <p className="text-foreground font-semibold mt-1">Total Astronaut Dose = Everyday Rays + Solar Storm Blast</p>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                AstroShield is a friendly learning console and planning estimator. It is not hospital medical equipment, but every single number is calibrated against real space instruments!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-sm font-medium text-foreground">Real Space Data Sources</h3>
              <ul className="mt-4 flex flex-col font-sans">
                <li className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:justify-between sm:gap-6">
                  <span className="font-medium text-sm text-foreground">NOAA Weather Satellites</span>
                  <span className="text-xs text-muted-foreground sm:text-right">
                    Live proton flux, magnetic storms, and solar flares
                  </span>
                </li>
                <li className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:justify-between sm:gap-6">
                  <span className="font-medium text-sm text-foreground">NASA Mars Curiosity (MSL RAD)</span>
                  <span className="text-xs text-muted-foreground sm:text-right">
                    Real radiation measured flying to Mars (1.84 mSv/d) &amp; on Mars surface (0.64 mSv/d)
                  </span>
                </li>
                <li className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:justify-between sm:gap-6">
                  <span className="font-medium text-sm text-foreground">China Moon Lander (Chang'e-4)</span>
                  <span className="text-xs text-muted-foreground sm:text-right">
                    Real radiation measured walking on the Moon (1.44 mSv/d)
                  </span>
                </li>
                <li className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:justify-between sm:gap-6">
                  <span className="font-medium text-sm text-foreground">India's Aditya-L1 Sun Watcher</span>
                  <span className="text-xs text-muted-foreground sm:text-right">
                    Early warning space sentinel 1.5M km towards the Sun
                  </span>
                </li>
                <li className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:justify-between sm:gap-6">
                  <span className="font-medium text-sm text-foreground">NASA Safety Rules (NASA-STD-3001)</span>
                  <span className="text-xs text-muted-foreground sm:text-right">
                    600 mSv lifetime career limit &amp; 250 mSv storm limit
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <StormScenarioModal
        isOpen={isStormModalOpen}
        onClose={() => setIsStormModalOpen(false)}
        destination={config.destination}
        durationDays={config.duration_days}
        baselineShielding={config.shielding_areal_density}
        onApplyScenario={(res) => setStormScenario(res)}
      />

      <AssumptionsDrawer
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
      />
    </div>
  );
};

export default App;
