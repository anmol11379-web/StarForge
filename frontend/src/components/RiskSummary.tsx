import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Flame, AlertOctagon, Sparkles, Info, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { MissionEstimateResponse, StormScenarioResponse } from '../types';
import { HelpBadge } from './HelpBadge';

interface RiskSummaryProps {
  estimate: MissionEstimateResponse | null;
  stormScenario: StormScenarioResponse | null;
  onClearStorm: () => void;
  onOpenStormModal: () => void;
}

export const RiskSummary: React.FC<RiskSummaryProps> = ({
  estimate,
  stormScenario,
  onClearStorm,
  onOpenStormModal,
}) => {
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  if (!estimate) return null;

  const activeEffective = stormScenario
    ? stormScenario.total_with_shelter_effective_msv
    : estimate.total_effective_dose_msv;

  const activeDoseEquiv = stormScenario
    ? (stormScenario.background_gcr_dose_equivalent_msv + stormScenario.spe_with_shelter_dose_equiv_msv)
    : estimate.total_dose_equivalent_msv;

  const activeRisk = stormScenario ? stormScenario.risk_with_shelter : estimate.risk_level;

  const getRiskDetails = (level: string) => {
    switch (level) {
      case 'Low':
        return {
          icon: ShieldCheck,
          label: 'Safe & Sound!',
          badge: 'All Clear',
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
        };
      case 'Moderate':
        return {
          icon: AlertTriangle,
          label: 'Caution (Radiation Climbing)',
          badge: 'Caution',
          color: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
        };
      case 'High':
        return {
          icon: Flame,
          label: 'Danger Zone! (Limit Passed)',
          badge: 'Elevated Risk',
          color: 'text-rose-400 border-rose-500/30 bg-rose-950/20',
        };
      case 'Critical':
      default:
        return {
          icon: AlertOctagon,
          label: 'Emergency Alert! (High Danger)',
          badge: 'Emergency',
          color: 'text-destructive border-destructive/40 bg-destructive/10',
        };
    }
  };

  const risk = getRiskDetails(activeRisk);
  const RiskIcon = risk.icon;

  const careerPct = Math.min(100, (activeEffective / 600) * 100);
  const thirtyDayPct = Math.min(100, (activeEffective / 250) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Result Card */}
      <motion.div
        layout
        className="rounded-lg border border-border bg-card p-6 transition-all duration-300"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {stormScenario ? 'Astronaut Radiation Dose (With Storm Shelter)' : 'Astronaut Radiation Dose'}
          </span>
          <span className="font-mono text-xs text-primary">{estimate.duration_days} days in space</span>
        </div>

        {/* Both Quantities Displayed Prominently */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-4 border-b border-border/60">
          {/* Effective Dose (E) */}
          <motion.div
            key={`eff-${activeEffective}`}
            initial={{ scale: 0.97, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="p-3.5 rounded-md border border-primary/30 bg-primary/5 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-semibold truncate">
                  Body Absorbed (E)
                </span>
                <HelpBadge term="effective_dose" />
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {activeEffective.toFixed(1)}
                </span>
                <span className="font-mono text-xs sm:text-sm text-primary font-semibold">
                  mSv
                </span>
              </div>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground mt-2 leading-relaxed">
              What human organs absorb. NASA limit: 600 mSv.
            </p>
          </motion.div>

          {/* Dose Equivalent (H) */}
          <motion.div
            key={`eq-${activeDoseEquiv}`}
            initial={{ scale: 0.97, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="p-3.5 rounded-md border border-border bg-secondary/40 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold truncate">
                  Raw Sensor (H)
                </span>
                <HelpBadge term="dose_equivalent" />
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-muted-foreground">
                  {activeDoseEquiv.toFixed(1)}
                </span>
                <span className="font-mono text-xs sm:text-sm text-muted-foreground font-semibold">
                  mSv
                </span>
              </div>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground mt-2 leading-relaxed">
              Raw sensor clicks (Mars Curiosity rover RAD).
            </p>
          </motion.div>
        </div>

        {/* Quantities Difference Explanatory Note */}
        <div className="mt-3 p-2.5 rounded bg-secondary/30 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
          <Info className="size-3.5 text-accent shrink-0 mt-0.5" />
          <span>
            <strong>Simple Analogy:</strong> Think of <em>Sensor Reading (H)</em> like how loud music is blasting in a room, and <em>Body Absorbed Dose (E)</em> like what your body and organs actually absorb. Human tissue absorbs about 65% of the raw space beam!
          </span>
        </div>

        {/* Risk Badge */}
        <motion.div
          layout
          className={`mt-4 rounded-md border p-3 flex items-start gap-3 ${risk.color} transition-all duration-300`}
        >
          <RiskIcon className="size-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium font-heading">{risk.label}</span>
              <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border border-current">
                {risk.badge}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground leading-relaxed">
              {stormScenario ? stormScenario.why_explanation : estimate.risk_reason}
            </p>
          </div>
        </motion.div>

        {/* NASA Limit Progress */}
        <div className="mt-5 space-y-3 pt-4 border-t border-border/60">
          <div>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <HelpBadge term="nasa_career_limit" />
                <span>NASA Lifetime Safety Budget (600 mSv)</span>
              </span>
              <span className="text-primary font-semibold">{careerPct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${careerPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full ${careerPct > 90 ? 'bg-destructive' : 'bg-primary'}`}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <HelpBadge term="nasa_30day_limit" />
                <span>NASA 30-Day Emergency Buffer (250 mSv)</span>
              </span>
              <span className="text-foreground">{thirtyDayPct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, thirtyDayPct)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full ${thirtyDayPct > 100 ? 'bg-destructive' : 'bg-accent'}`}
              />
            </div>
          </div>
        </div>

        {/* Storm Trigger / Reset */}
        <div className="mt-6 pt-4 border-t border-border/60">
          {stormScenario ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onClearStorm}
              className="w-full py-2.5 rounded-md border border-[#38bdf8]/40 bg-[#0c1e38] hover:bg-[#132d54] text-[#f8fafc] text-xs font-medium transition-colors"
            >
              Reset to normal space cruise (Clear storm)
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onOpenStormModal}
              className="w-full py-2.5 rounded-md border border-[#38bdf8]/50 bg-[#0c1e38] hover:bg-[#38bdf8] hover:text-slate-950 text-[#38bdf8] text-xs font-semibold transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            >
              <Sparkles className="size-3.5 text-primary group-hover:text-slate-950 transition-colors" />
              <span>Simulate Solar Storm Attack!</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Why This Number Card */}
      <motion.div
        layout
        className="rounded-lg border border-border bg-card overflow-hidden"
      >
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between p-4 bg-secondary/20 hover:bg-secondary/40 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-accent" />
            <h3 className="font-medium text-xs sm:text-sm text-foreground">
              Calculation Breakdown &amp; Factors
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>{showBreakdown ? 'Hide Details' : 'Show Details'}</span>
            {showBreakdown ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </button>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="p-5 border-t border-border/60"
            >
              <dl className="flex flex-col gap-2.5 font-mono text-xs">
                <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Raw sensor radiation per day</dt>
                  <dd className="text-foreground font-semibold">{estimate.daily_dose_equivalent_rate_msv} mSv/day</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Body absorbed dose per day</dt>
                  <dd className="text-primary font-semibold">{estimate.daily_effective_dose_rate_msv} mSv/day</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Body absorption ratio</dt>
                  <dd className="text-foreground">65% (Human body absorbs ~2/3 of space rays)</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Spaceship wall armor</dt>
                  <dd className="text-foreground">{estimate.shielding_areal_density.toFixed(1)} g/cm² ({estimate.shielding_material})</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Sun activity state</dt>
                  <dd className="text-foreground">
                    {estimate.solar_cycle_phase === 'solar_min' ? 'Sleepy Sun (+25% deep space rays)' : estimate.solar_cycle_phase === 'solar_max' ? 'Active Sun (-22% deep space rays)' : 'Normal Sun'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Emergency storm shelter</dt>
                  <dd className="text-accent font-semibold">{stormScenario ? 'Bunker active (Astronauts safe inside!)' : 'Crew in regular rooms'}</dd>
                </div>
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
