import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { ModelAssumptionsResponse } from '../types';
import { fetchModelAssumptions } from '../services/api';

interface AssumptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssumptionsDrawer: React.FC<AssumptionsDrawerProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<ModelAssumptionsResponse | null>(null);

  useEffect(() => {
    if (isOpen && !data) {
      fetchModelAssumptions()
        .then((res) => setData(res))
        .catch((err) => console.error(err));
    }
  }, [isOpen, data]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-xl border-l border-border bg-card p-6 flex flex-col justify-between overflow-y-auto relative z-10 shadow-2xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      <BookOpen className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-heading font-medium text-lg text-foreground">
                        How Space Physics &amp; Math Work
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Real formulas from NASA and Mars rovers, explained simply!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Disclaimer Alert */}
                <div className="p-3.5 rounded-md border border-border bg-secondary/30 text-xs leading-relaxed mb-5 flex items-start gap-2.5">
                  <ShieldCheck className="size-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-medium text-foreground mb-0.5">Planning &amp; Learning Tool:</strong>
                    AstroShield is a friendly space explorer console for education and early mission design. It is not medical hospital software! All calculations are grounded in real measurements from NASA Curiosity and China's Chang'e-4.
                  </div>
                </div>

                {/* Core Equations & Methodology */}
                <div className="space-y-4 mb-6 text-xs text-muted-foreground">
                  
                  {/* 1. Dose Equivalent vs Effective Dose */}
                  <div className="p-4 rounded-md border border-border bg-background">
                    <h4 className="font-medium text-foreground mb-1 text-sm text-primary">
                      1. Sensor Reading (H) vs Body Absorbed Dose (E)
                    </h4>
                    <p className="leading-relaxed mb-2">
                      When a robot sensor (like MSL RAD on Mars) measures radiation in space, it records the raw physical beam, called <strong>Dose Equivalent (H)</strong>. But humans have organs (like bone marrow and lungs) that absorb rays differently. That absorbed amount is called <strong>Effective Dose (E)</strong>.
                    </p>
                    <div className="p-2 rounded bg-secondary font-mono text-[11px] text-foreground mb-2">
                      Effective Dose (E) = Sensor Dose (H) × 0.65
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      NASA data from the Mars rover cruise shows that our human body absorbs about 63% to 67% (roughly 2/3) of the raw space radiation beam!
                    </p>
                  </div>

                  {/* 2. Saturated Shielding with Aluminium Buildup */}
                  <div className="p-4 rounded-md border border-border bg-background">
                    <h4 className="font-medium text-foreground mb-1 text-sm text-accent">
                      2. Why Making Metal Walls Too Thick Is Bad
                    </h4>
                    <p className="leading-relaxed mb-2">
                      You might think: <em>"Just make the spaceship metal super thick!"</em> But in deep space, high-energy cosmic rays smash into heavy metal atoms like bowling balls hitting pins! This shatters the metal and creates lots of tiny, fast secondary neutrons.
                    </p>
                    <div className="p-2 rounded bg-secondary font-mono text-[11px] text-foreground mb-2">
                      Shield Factor = Floor + (1 − Floor) × exp(−Thickness / λ) + Neutron Buildup
                    </div>
                    <p className="leading-relaxed">
                      Aluminium shields stop helping after 20–25 g/cm² and start creating secondary neutron dust. Meanwhile, lightweight hydrogen materials (like plastic and water) act like soft pillows that catch particles without shattering!
                    </p>
                  </div>

                  {/* 3. Areal Density Input Unit */}
                  <div className="p-4 rounded-md border border-border bg-background">
                    <h4 className="font-medium text-foreground mb-1 text-sm text-foreground">
                      3. What is "Areal Density" (g/cm²)?
                    </h4>
                    <p className="leading-relaxed">
                      In space engineering, we measure armor by <strong>how many grams a square centimeter weighs</strong> (g/cm²). This tells engineers exactly how much mass a rocket needs to launch. We calculate each material truthfully instead of guessing with old "aluminium-equivalent" shortcuts.
                    </p>
                  </div>

                  {/* 4. Empirical Calibration Baselines */}
                  <div className="p-4 rounded-md border border-border bg-background">
                    <h4 className="font-medium text-foreground mb-2 text-sm">
                      4. Real Numbers Measured in Deep Space
                    </h4>
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      <li className="flex justify-between border-b border-border/60 pb-1">
                        <span>Flying to Mars (NASA Curiosity cruise):</span>
                        <span className="text-primary font-semibold">1.84 mSv per day</span>
                      </li>
                      <li className="flex justify-between border-b border-border/60 pb-1">
                        <span>Camping on Mars (Curiosity on ground):</span>
                        <span className="text-primary font-semibold">0.64 mSv per day (Ground blocks half!)</span>
                      </li>
                      <li className="flex justify-between border-b border-border/60 pb-1">
                        <span>Moon Surface (China Chang'e-4 lander):</span>
                        <span className="text-primary font-semibold">1.44 mSv per day</span>
                      </li>
                      <li className="flex justify-between">
                        <span>2012 Solar Storm measured in space:</span>
                        <span className="text-primary font-semibold">19.5 mSv (Benchmark storm)</span>
                      </li>
                    </ul>
                  </div>

                  {/* 5. NASA Limits */}
                  <div className="p-4 rounded-md border border-border bg-background">
                    <h4 className="font-medium text-foreground mb-2 text-sm">
                      5. NASA's Official Safety Rules (NASA-STD-3001 Rev C)
                    </h4>
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      <li className="flex justify-between border-b border-border/60 pb-1">
                        <span>Astronaut Lifetime Safety Limit:</span>
                        <span className="text-destructive font-semibold">600 mSv (Lifetime budget)</span>
                      </li>
                      <li className="flex justify-between border-b border-border/60 pb-1">
                        <span>30-Day Emergency Limit:</span>
                        <span className="text-primary font-semibold">250 mSv per storm event</span>
                      </li>
                      <li className="flex justify-between">
                        <span>1-Year Mission Step Limit:</span>
                        <span className="text-foreground font-semibold">500 mSv in one year</span>
                      </li>
                    </ul>
                  </div>

                  {/* 6. Citations */}
                  <div className="p-4 rounded-md border border-border bg-background">
                    <h4 className="font-medium text-foreground mb-2 text-sm flex items-center gap-1.5">
                      <ExternalLink className="size-3.5 text-accent" />
                      <span>Real Space Mission Scientific Papers</span>
                    </h4>
                    <ul className="space-y-2 text-[11px] leading-normal">
                      <li>• <strong>NASA Curiosity Mars Flight:</strong> Zeitlin et al., <em>Science</em> 340, 1080 (2013).</li>
                      <li>• <strong>Mars Surface Rover:</strong> Hassler et al., <em>Science</em> 343, 1244797 (2014).</li>
                      <li>• <strong>Moon Surface Lander:</strong> Zhang et al., <em>Science Advances</em> (Chang'e-4, 2020).</li>
                      <li>• <strong>NASA Standards:</strong> NASA-STD-3001, Vol 1 Rev C (Approved 15 Sept 2023).</li>
                      <li>• <strong>India's Aditya-L1:</strong> ISRO ISSDC &amp; Zenodo open dataset (ASPEX STEPS 2024).</li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Footer of Drawer */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>ASTRA 2026 • Domain 5</span>
                <button
                  onClick={onClose}
                  className="py-1.5 px-4 rounded-md border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
