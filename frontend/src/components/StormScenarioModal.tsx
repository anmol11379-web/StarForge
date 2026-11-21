import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Zap, CheckCircle2 } from 'lucide-react';
import { StormScenarioRequest, StormScenarioResponse } from '../types';
import { simulateStormScenario } from '../services/api';
import { HelpBadge } from './HelpBadge';

interface StormScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  durationDays: number;
  baselineShielding: number;
  onApplyScenario: (result: StormScenarioResponse) => void;
}

export const StormScenarioModal: React.FC<StormScenarioModalProps> = ({
  isOpen,
  onClose,
  destination,
  durationDays,
  baselineShielding,
  onApplyScenario,
}) => {
  const [stormDay, setStormDay] = useState<number>(Math.min(45, Math.max(1, Math.floor(durationDays / 2))));
  const [stormClass, setStormClass] = useState<string>('S3');
  const [shelterShielding, setShelterShielding] = useState<number>(35.0);
  const [shelterMaterial, setShelterMaterial] = useState<string>('polyethylene');
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<StormScenarioResponse | null>(null);

  const stormClasses = [
    { id: 'S1', name: 'S1 Minor Rumble', flux: '10 pfu', dose: '~3.5 mSv' },
    { id: 'S2', name: 'S2 Moderate Storm', flux: '100 pfu', dose: '~25 mSv' },
    { id: 'S3', name: 'S3 Big Solar Tempest', flux: '1,000 pfu', dose: '~120 mSv' },
    { id: 'S4', name: 'S4 Monster Storm', flux: '10,000 pfu', dose: '~450 mSv' },
    { id: 'S5', name: 'S5 Mega Extreme Storm', flux: '100,000 pfu', dose: '~1,500 mSv' },
  ];

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const req: StormScenarioRequest = {
        destination,
        duration_days: durationDays,
        baseline_shielding: baselineShielding,
        storm_day: stormDay,
        storm_class: stormClass,
        shelter_shielding: shelterShielding,
        shelter_material: shelterMaterial,
      };
      const res = await simulateStormScenario(req);
      setPreview(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onApplyScenario(preview);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-xl rounded-lg border border-border bg-card p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
              <div className="size-9 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Sun className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-medium text-foreground">
                  Solar Storm Attack Simulator!
                </h3>
                <p className="text-xs text-muted-foreground">
                  See how an emergency storm bunker protects astronauts from giant solar flares
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-5 mb-6">
              
              {/* Day */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-foreground">
                    What day does the solar storm strike?
                  </label>
                  <span className="font-mono text-primary text-xs">Day {stormDay} of {durationDays}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={durationDays}
                  value={stormDay}
                  onChange={(e) => {
                    setStormDay(parseInt(e.target.value));
                    setPreview(null);
                  }}
                  className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Severity Class */}
              <div>
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1.5">
                  <HelpBadge term="noaa_s_scale" />
                  <span>Solar Storm Danger Rating (NOAA S-Scale)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {stormClasses.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        setStormClass(sc.id);
                        setPreview(null);
                      }}
                      className={`p-2.5 rounded-md text-left border transition-colors ${
                        stormClass === sc.id
                          ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary/40'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="font-medium text-xs text-foreground">{sc.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{sc.flux}</div>
                      <div className="font-mono text-[10px] text-primary">{sc.dose}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shelter Config */}
              <div className="p-4 rounded-md border border-border bg-secondary/30">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-3">
                  <HelpBadge term="storm_shelter" />
                  <span>Emergency Storm Bunker Settings</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">
                      Bunker wall material
                    </label>
                    <select
                      value={shelterMaterial}
                      onChange={(e) => {
                        setShelterMaterial(e.target.value);
                        setPreview(null);
                      }}
                      className="w-full p-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-sans"
                    >
                      <option value="polyethylene">Special Plastic (HDPE - Best)</option>
                      <option value="water">Drinking Water Tanks</option>
                      <option value="aluminium">Metal Aluminium Walls</option>
                      <option value="regolith">Moon / Mars Dirt Bunker</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] text-muted-foreground">
                        Bunker wall thickness
                      </label>
                      <span className="font-mono text-xs text-primary">{shelterShielding} g/cm²</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="100"
                      step="5"
                      value={shelterShielding}
                      onChange={(e) => {
                        setShelterShielding(parseFloat(e.target.value));
                        setPreview(null);
                      }}
                      className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer mt-2"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Action Button */}
            {!preview && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSimulate}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-md bg-primary hover:opacity-90 text-primary-foreground font-medium text-xs transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="size-4" />
                <span>{loading ? 'Simulating storm blast...' : 'Fire Solar Storm Simulation!'}</span>
              </motion.button>
            )}

            {/* Results */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-border bg-secondary/20 p-4 mb-4"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/60">
                  <span className="font-heading font-medium text-sm text-foreground">
                    Storm Impact Results
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-semibold">
                    -{preview.reduction_percentage}% Radiation Blocked!
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center mb-3 font-mono">
                  <div className="p-2.5 rounded border border-destructive/40 bg-destructive/10">
                    <span className="text-[10px] text-muted-foreground block">Without Bunker (Regular Room)</span>
                    <span className="text-base font-semibold text-destructive">{preview.total_without_shelter_msv} mSv</span>
                    <span className="text-[10px] block text-destructive mt-0.5">{preview.risk_without_shelter}</span>
                  </div>
                  <div className="p-2.5 rounded border border-emerald-500/30 bg-emerald-950/20">
                    <span className="text-[10px] text-muted-foreground block">Inside Storm Bunker (Safe!)</span>
                    <span className="text-base font-semibold text-emerald-400">{preview.total_with_shelter_msv} mSv</span>
                    <span className="text-[10px] block text-emerald-400 mt-0.5">{preview.risk_with_shelter}</span>
                  </div>
                </div>

                <div className="p-3 rounded border border-border bg-background text-xs text-muted-foreground leading-relaxed mb-4">
                  <p>{preview.why_explanation}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-2 px-4 rounded-md bg-primary hover:opacity-90 text-primary-foreground font-medium text-xs transition-opacity flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Apply Storm to Timeline</span>
                  </button>
                  <button
                    onClick={() => setPreview(null)}
                    className="py-2 px-3 rounded-md border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs"
                  >
                    Change Storm
                  </button>
                </div>
              </motion.div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
