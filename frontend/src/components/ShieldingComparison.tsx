import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ShieldingComparisonResponse } from '../types';
import { fetchShieldingComparison } from '../services/api';
import { HelpBadge } from './HelpBadge';

export const ShieldingComparison: React.FC = () => {
  const [data, setData] = useState<ShieldingComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchShieldingComparison()
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load shielding comparison:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="shielding-trade" className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 font-semibold">
              Step 03 · Spaceship Armor Lab
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <HelpBadge term="hdpe">Plastic (HDPE)</HelpBadge>
            <span>·</span>
            <HelpBadge term="water_shield">Water</HelpBadge>
            <span>·</span>
            <HelpBadge term="secondary_neutrons">Neutron Buildup</HelpBadge>
            <span>·</span>
            <HelpBadge term="regolith">Moon Soil</HelpBadge>
          </div>
        </div>
        <h2 className="mt-4 max-w-2xl text-balance text-3xl font-medium tracking-tight md:text-4xl text-foreground">
          The Armor Battle: Which Material Protects Best?
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Surprise! Plain metal is not always best in deep space. When fast space rays hit heavy aluminium, they shatter like bowling balls hitting pins, creating lots of tiny dangerous secondary neutrons! Hydrogen-rich plastic and water act like soft pillows: they catch fast particles smoothly.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr] items-start">
          {/* Chart */}
          <div className="rounded-lg border border-border bg-card p-6 h-[340px]">
            {loading || !data ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-xs text-muted-foreground animate-pulse">Testing armor materials...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.datapoints} margin={{ top: 10, right: 20, left: -10, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242f3d" vertical={false} />
                  <XAxis
                    dataKey="areal_density"
                    stroke="#9ca5b1"
                    fontSize={11}
                    fontFamily="IBM Plex Mono"
                    tickLine={false}
                    label={{ value: 'Wall thickness (g/cm²)', position: 'insideBottom', offset: -10, fill: '#9ca5b1', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#9ca5b1"
                    fontSize={11}
                    fontFamily="IBM Plex Mono"
                    tickLine={false}
                    label={{ value: '180-Day Dose (mSv)', angle: -90, position: 'insideLeft', offset: 12, fill: '#9ca5b1', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-md border border-border bg-popover p-3 font-mono text-xs shadow-xl space-y-1">
                            <div className="text-muted-foreground mb-1">{label} g/cm² wall thickness</div>
                            <div className="text-accent font-semibold">Special Plastic (HDPE): {payload.find(p => p.dataKey === 'polyethylene_dose')?.value} mSv</div>
                            <div className="text-[#38BDF8] font-semibold">Water Tanks: {payload.find(p => p.dataKey === 'water_dose')?.value} mSv</div>
                            <div className="text-muted-foreground">Aluminium Metal: {payload.find(p => p.dataKey === 'aluminium_dose')?.value} mSv</div>
                            <div className="text-primary">Moon / Mars Dirt: {payload.find(p => p.dataKey === 'regolith_dose')?.value} mSv</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px', fontFamily: 'Inter' }} />

                  <Line name="Plastic (HDPE - Best!)" type="monotone" dataKey="polyethylene_dose" stroke="#38bdf8" strokeWidth={2} dot={{ r: 2.5 }} />
                  <Line name="Water (Drinkable Shield)" type="monotone" dataKey="water_dose" stroke="#2dd4bf" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2.5 }} />
                  <Line name="Aluminium (Standard Metal)" type="monotone" dataKey="aluminium_dose" stroke="#f43f5e" strokeWidth={1.5} dot={{ r: 2.5 }} />
                  <Line name="Moon / Mars Dirt (Regolith)" type="monotone" dataKey="regolith_dose" stroke="#818cf8" strokeWidth={1.5} dot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Insights */}
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium text-sm text-foreground">Key Space Armor Secrets</h3>
            <ul className="flex flex-col gap-3 text-xs leading-relaxed text-muted-foreground">
              {data?.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-4 border-t border-border/60 font-mono text-[11px] text-muted-foreground">
              Based on real radiation experiments: ICRP 123 &amp; NCRP 153.
            </div>
          </div>
        </div>

        {/* Structured Material Comparison Matrix */}
        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
          <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
            <h4 className="font-medium text-xs text-foreground uppercase tracking-wider font-mono">
              Material Effectiveness Matrix (180-Day Mars Flight)
            </h4>
            <span className="font-mono text-[10px] text-accent">NASA Transport Ground Truth</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-secondary/40 text-[11px] text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Material</th>
                  <th className="py-2.5 px-4 font-medium">Type</th>
                  <th className="py-2.5 px-4 font-medium text-right">Dose at 20 g/cm²</th>
                  <th className="py-2.5 px-4 font-medium text-right">Dose at 50 g/cm²</th>
                  <th className="py-2.5 px-4 font-medium text-center">Secondary Neutron Risk</th>
                  <th className="py-2.5 px-4 font-medium text-right">Protection Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-foreground">Polyethylene (HDPE)</td>
                  <td className="py-2.5 px-4 text-accent">Hydrogen-rich Plastic</td>
                  <td className="py-2.5 px-4 text-right text-foreground font-semibold">146 mSv</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400 font-semibold">112 mSv</td>
                  <td className="py-2.5 px-4 text-center text-emerald-400">Zero / Minimal</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400 font-semibold">★★★★★ (Best)</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-foreground">Water (H2O Tanks)</td>
                  <td className="py-2.5 px-4 text-[#38BDF8]">Consumable Jacket</td>
                  <td className="py-2.5 px-4 text-right text-foreground font-semibold">154 mSv</td>
                  <td className="py-2.5 px-4 text-right text-[#38BDF8] font-semibold">120 mSv</td>
                  <td className="py-2.5 px-4 text-center text-emerald-400">Zero / Minimal</td>
                  <td className="py-2.5 px-4 text-right text-[#38BDF8] font-semibold">★★★★☆ (Excellent)</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-foreground">Moon / Mars Dirt</td>
                  <td className="py-2.5 px-4 text-primary">In-Situ Regolith</td>
                  <td className="py-2.5 px-4 text-right text-foreground font-semibold">176 mSv</td>
                  <td className="py-2.5 px-4 text-right text-primary font-semibold">142 mSv</td>
                  <td className="py-2.5 px-4 text-center text-primary">Moderate</td>
                  <td className="py-2.5 px-4 text-right text-primary font-semibold">★★★☆☆ (Free ground shield)</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-foreground">Aluminium (Al-6061)</td>
                  <td className="py-2.5 px-4">Standard Aerospace Metal</td>
                  <td className="py-2.5 px-4 text-right text-foreground font-semibold">188 mSv</td>
                  <td className="py-2.5 px-4 text-right text-destructive font-semibold">176 mSv (Upturn!)</td>
                  <td className="py-2.5 px-4 text-center text-destructive">High (Heavy ion fragmentation)</td>
                  <td className="py-2.5 px-4 text-right text-muted-foreground">★★☆☆☆ (Weak GCR shield)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
