import React from 'react';
import { MissionEstimateRequest } from '../types';
import { HelpBadge } from './HelpBadge';

interface MissionBuilderProps {
  config: MissionEstimateRequest;
  onChange: (newConfig: MissionEstimateRequest) => void;
  loading: boolean;
  showStep3?: boolean;
}

export const SolarCycleCard: React.FC<{
  config: MissionEstimateRequest;
  onChange: (newConfig: MissionEstimateRequest) => void;
}> = ({ config, onChange }) => {
  const cycles = [
    { id: 'solar_min', label: 'Sleepy Sun (Minimum)', note: 'More deep space rays! (+25%)' },
    { id: 'solar_moderate', label: 'Normal Sun', note: 'Standard space weather' },
    { id: 'solar_max', label: 'Active Sun (Maximum)', note: 'Fewer deep rays, more flares! (-22%)' },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-semibold">
            Step 03
          </span>
          <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <HelpBadge term="solar_cycle" />
            <span>Sun Activity Cycle (11-Year Pattern)</span>
          </h3>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground uppercase">11-Year Cycle</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {cycles.map((cyc) => {
          const isSelected = config.solar_cycle_phase === cyc.id;
          return (
            <button
              key={cyc.id}
              type="button"
              onClick={() => onChange({ ...config, solar_cycle_phase: cyc.id })}
              className={`cursor-pointer rounded-md border p-3 text-center text-xs transition-colors ${
                isSelected
                  ? 'border-[#38bdf8] bg-[#0c1e38] text-[#f8fafc] font-semibold ring-1 ring-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'border-border text-muted-foreground hover:text-[#f8fafc] hover:bg-[#0c1e38]/50 hover:border-[#38bdf8]/40'
              }`}
            >
              <div className="font-medium text-foreground">{cyc.label}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{cyc.note}</div>
            </button>
          );
        })}
      </div>

      <div className="p-2.5 rounded bg-secondary/30 text-[11px] text-muted-foreground leading-relaxed">
        <strong>Why this matters:</strong> When the Sun is at minimum activity, its magnetic field weakens, allowing ~25% more galactic cosmic rays to penetrate deep space. At maximum activity, cosmic rays drop but explosive solar flare events increase.
      </div>
    </div>
  );
};

export const MissionBuilder: React.FC<MissionBuilderProps> = ({ config, onChange, loading, showStep3 = false }) => {
  const environments = [
    { id: 'mars_transit', label: 'Flying to Mars (Deep Space)', rate: '1.84 mSv/day · Full space exposure' },
    { id: 'mars_surface', label: 'Camping on Mars', rate: '0.64 mSv/day · Planet blocks half the rays!' },
    { id: 'lunar_surface', label: 'Exploring the Moon', rate: '1.36 mSv/day · Walking on Moon dirt' },
    { id: 'lunar_orbit', label: 'Orbiting Earth or Moon', rate: '1.65 mSv/day · High space orbit' },
  ];

  const materials = [
    { id: 'aluminium', term: 'secondary_neutrons', label: 'Aluminium Metal', sub: 'Standard metal (creates neutron dust if thick)' },
    { id: 'polyethylene', term: 'hdpe', label: 'Hydrogen Plastic (HDPE)', sub: 'Best shield! Absorbs rays like a soft pillow' },
    { id: 'water', term: 'water_shield', label: 'Water Shield Tanks', sub: 'Great shield + astronauts can drink it!' },
    { id: 'regolith', term: 'regolith', label: 'Moon / Mars Dirt', sub: 'Free local soil to pile over your moonbase' },
  ];

  return (
    <div className="flex flex-col gap-5" aria-label="Mission parameters">
      
      {/* CARD 1: Destination & Flight Duration */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-semibold">
              Step 01
            </span>
            <h3 className="text-sm font-medium text-foreground">Flight Destination &amp; Duration</h3>
          </div>
          {loading && <span className="font-mono text-xs text-accent animate-pulse">Calculating...</span>}
        </div>

        {/* Radiation Environment Grid */}
        <div>
          <label className="text-xs font-medium text-foreground block mb-2">
            Where is your spacecraft traveling?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {environments.map((env) => {
              const isSelected = config.destination === env.id;
              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => onChange({ ...config, destination: env.id })}
                  className={`cursor-pointer rounded-md border p-3 text-left text-xs transition-colors ${
                    isSelected
                      ? 'border-[#38bdf8] bg-[#0c1e38] text-[#f8fafc] font-semibold ring-1 ring-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'border-border text-muted-foreground hover:text-[#f8fafc] hover:bg-[#0c1e38]/50 hover:border-[#38bdf8]/40'
                  }`}
                >
                  <div className="font-medium text-foreground">{env.label}</div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{env.rate}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mission Duration */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-foreground">How many days in space?</label>
            <div className="flex items-center gap-1.5 rounded-md border border-border/80 bg-[#080e16] px-2.5 py-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-inner">
              <input
                type="number"
                min="1"
                max="1200"
                value={config.duration_days}
                onChange={(e) =>
                  onChange({ ...config, duration_days: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-16 bg-transparent text-right font-mono text-sm font-bold text-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="font-mono text-xs text-muted-foreground select-none">days</span>
            </div>
          </div>
          <input
            type="range"
            min="7"
            max="1000"
            step="7"
            value={config.duration_days}
            onChange={(e) => onChange({ ...config, duration_days: parseInt(e.target.value) })}
            className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>7d (Quick Moon)</span>
            <span>180d (Mars Flight)</span>
            <span>500d (Mars Base)</span>
            <span>1000d (Full Trip)</span>
          </div>
        </div>

        {/* Crew Size */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-foreground">How many astronauts on board?</label>
            <span className="font-mono text-xs text-primary font-semibold">{config.crew_size} crew</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[2, 4, 6, 8].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ ...config, crew_size: size })}
                className={`rounded-md border py-1.5 text-center font-mono text-xs transition-colors ${
                  config.crew_size === size
                    ? 'border-[#38bdf8] bg-[#0c1e38] text-[#f8fafc] font-semibold ring-1 ring-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                    : 'border-border text-muted-foreground hover:text-[#f8fafc] hover:bg-[#0c1e38]/50 hover:border-[#38bdf8]/40'
                }`}
              >
                {size} crew
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARD 2: Spacecraft Armor & Material */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-semibold">
              Step 02
            </span>
            <h3 className="text-sm font-medium text-foreground">Spacecraft Hull &amp; Shield Armor</h3>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-primary font-semibold">{config.shielding_areal_density.toFixed(1)}</span>
            <span className="text-muted-foreground">g/cm²</span>
          </div>
        </div>

        {/* Thickness Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <HelpBadge term="areal_density" />
              <span>Spaceship Wall Thickness (g/cm²)</span>
            </label>
            <span className="text-[11px] text-muted-foreground font-mono">
              {config.shielding_areal_density >= 45 ? 'Heavy Armor' : config.shielding_areal_density >= 20 ? 'Standard Hull' : 'Lightweight'}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="100"
            step="1"
            value={config.shielding_areal_density}
            onChange={(e) => onChange({ ...config, shielding_areal_density: parseFloat(e.target.value) })}
            className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>5 (Thin Apollo)</span>
            <span>20 (Standard Ship)</span>
            <span>45 (Heavy Hull)</span>
            <span>100 (Buried Dirt)</span>
          </div>
        </div>

        {/* Material Selection */}
        <div className="pt-2">
          <label className="text-xs font-medium text-foreground block mb-2">
            Primary Shielding Material
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {materials.map((mat) => {
              const isSelected = config.shielding_material === mat.id;
              return (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => onChange({ ...config, shielding_material: mat.id })}
                  className={`cursor-pointer rounded-md border p-2.5 text-left text-xs transition-colors ${
                    isSelected
                      ? 'border-[#38bdf8] bg-[#0c1e38] text-[#f8fafc] font-semibold ring-1 ring-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'border-border text-muted-foreground hover:text-[#f8fafc] hover:bg-[#0c1e38]/50 hover:border-[#38bdf8]/40'
                  }`}
                >
                  <div className="font-medium text-foreground flex items-center gap-1.5">
                    <HelpBadge term={mat.term} />
                    <span>{mat.label}</span>
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{mat.sub}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CARD 3: Solar Environment & Space Weather (Rendered here only if showStep3 is true) */}
      {showStep3 && (
        <SolarCycleCard config={config} onChange={onChange} />
      )}

    </div>
  );
};
