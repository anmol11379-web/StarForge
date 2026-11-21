import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Zap, Sun } from 'lucide-react';
import { AdityaL1Telemetry } from '../types';
import { fetchAdityaL1Data } from '../services/api';
import { HelpBadge } from './HelpBadge';

export const AdityaL1Panel: React.FC = () => {
  const [data, setData] = useState<AdityaL1Telemetry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'protons' | 'xrays'>('protons');

  useEffect(() => {
    fetchAdityaL1Data()
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load Aditya-L1 data:', err))
      .finally(() => setLoading(false));
  }, []);

  const protonChartData = data?.aspex_proton_datapoints.map((pt) => ({
    time: pt.timestamp.replace('2024-', '').replace('T', ' ').substring(0, 11),
    aspex_steps: pt.aspex_steps_flux,
    noaa_goes_proton: pt.noaa_goes_proton_flux,
    solar_wind: pt.solar_wind_speed_kms,
  })) || [];

  const xrayChartData = data?.solexs_xray_datapoints.map((pt) => ({
    time: pt.timestamp.replace('2024-', '').replace('T', ' ').substring(0, 11),
    solexs_counts: pt.solexs_counts_sec,
    noaa_goes_xray: pt.noaa_goes_xray_flux,
    flare_class: pt.flare_class,
  })) || [];

  return (
    <section id="aditya-l1" className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 font-semibold">
              Step 04 · Early Warning System
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Space Sentinels</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-secondary text-primary font-semibold">
              Real ISRO &amp; NOAA Telemetry
            </span>
          </div>
        </div>
        <h2 className="mt-4 max-w-2xl text-balance text-3xl font-medium tracking-tight md:text-4xl text-foreground">
          India's Aditya-L1 vs NOAA GOES Weather Satellites
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Meet our space guardians! Aditya-L1 is India's solar observatory parked at <HelpBadge term="lagrange_l1">Sun-Earth L1 (1.5 million km away)</HelpBadge>. Because it sits far ahead of Earth, it catches solar storm clouds <strong>30 to 60 minutes before they reach Earth or the Moon!</strong> That gives astronauts vital warning time to take cover in their storm bunker.
        </p>

        {/* Tab Switcher */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border/60 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('protons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs transition-colors ${
              activeTab === 'protons'
                ? 'bg-[#0c1e38] border border-[#38bdf8] text-[#38bdf8] font-semibold shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-[#38bdf8]/40'
                : 'border border-border bg-card text-muted-foreground hover:text-[#f8fafc] hover:bg-[#0c1e38]/50 hover:border-[#38bdf8]/40'
            }`}
          >
            <HelpBadge term="aspex" />
            <Zap className="size-3.5" />
            <span>Flying Particles: Aditya-L1 ASPEX vs NOAA Protons</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('xrays')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs transition-colors ${
              activeTab === 'xrays'
                ? 'bg-[#0c1e38] border border-[#38bdf8] text-[#38bdf8] font-semibold shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-[#38bdf8]/40'
                : 'border border-border bg-card text-muted-foreground hover:text-[#f8fafc] hover:bg-[#0c1e38]/50 hover:border-[#38bdf8]/40'
            }`}
          >
            <HelpBadge term="solexs" />
            <Sun className="size-3.5" />
            <span>Solar Flares: Aditya-L1 SoLEXS vs NOAA X-Rays</span>
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] items-start">
          {/* Chart Display */}
          <div className="rounded-lg border border-border bg-card p-6 h-[340px]">
            {loading || !data ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-xs text-muted-foreground animate-pulse">Loading satellite data from space...</span>
              </div>
            ) : activeTab === 'protons' ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={protonChartData} margin={{ top: 10, right: 20, left: -10, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242f3d" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#9ca5b1"
                    fontSize={10}
                    fontFamily="IBM Plex Mono"
                    tickLine={false}
                    label={{ value: 'Timeline (UTC) · Historic May 2024 Solar Storm', position: 'insideBottom', offset: -10, fill: '#9ca5b1', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#9ca5b1"
                    fontSize={11}
                    fontFamily="IBM Plex Mono"
                    tickLine={false}
                    label={{ value: 'Speeding Protons (pfu)', angle: -90, position: 'insideLeft', offset: 12, fill: '#9ca5b1', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-md border border-border bg-popover p-3 font-mono text-xs shadow-xl space-y-1">
                            <div className="text-muted-foreground mb-1">{label} UTC</div>
                            <div className="text-primary font-semibold">Aditya-L1 (ASPEX at L1): {payload.find(p => p.dataKey === 'aspex_steps')?.value} pfu</div>
                            <div className="text-accent">NOAA GOES-16 (Near Earth): {payload.find(p => p.dataKey === 'noaa_goes_proton')?.value} pfu</div>
                            <div className="text-muted-foreground text-[10px]">Solar wind speed: {payload.find(p => p.dataKey === 'solar_wind')?.value} km/s</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px', fontFamily: 'Inter' }} />

                  <Line name="India's Aditya-L1 (Early Warning Sentinel at L1)" type="monotone" dataKey="aspex_steps" stroke="#38bdf8" strokeWidth={2} dot={{ r: 2.5 }} />
                  <Line name="NOAA GOES-16 (Weather Satellite near Earth)" type="monotone" dataKey="noaa_goes_proton" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2.5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={xrayChartData} margin={{ top: 10, right: 20, left: -10, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242f3d" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#9ca5b1"
                    fontSize={10}
                    fontFamily="IBM Plex Mono"
                    tickLine={false}
                    label={{ value: 'Timeline (UTC) · Solar Flare Eruptions', position: 'insideBottom', offset: -10, fill: '#9ca5b1', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#9ca5b1"
                    fontSize={11}
                    fontFamily="IBM Plex Mono"
                    tickLine={false}
                    label={{ value: 'SoLEXS Counts/sec', angle: -90, position: 'insideLeft', offset: 12, fill: '#9ca5b1', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="rounded-md border border-border bg-popover p-3 font-mono text-xs shadow-xl space-y-1">
                            <div className="text-muted-foreground mb-1">{label} UTC</div>
                            <div className="text-primary font-semibold">SoLEXS (2-22 keV X-rays): {p.solexs_counts.toLocaleString()} cps</div>
                            <div className="text-accent">NOAA Flare Class: {p.flare_class}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px', fontFamily: 'Inter' }} />

                  <Line name="Aditya-L1 SoLEXS (Soft X-Ray Spectrometer)" type="monotone" dataKey="solexs_counts" stroke="#38bdf8" strokeWidth={2} dot={{ r: 2.5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Satellite Details Sidebar */}
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium text-sm text-foreground">Why Aditya-L1 is Awesome</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {activeTab === 'protons'
                ? "Aditya-L1's ASPEX instrument counts high-energy space protons. Because Aditya-L1 is located 1.5 million kilometers out from Earth towards the Sun, it senses particle fronts before they strike Earth satellites, giving astronauts early alarm sirens!"
                : "Aditya-L1's SoLEXS instrument is an X-ray camera that watches solar flares unfold in real-time. It measures the Sun's brightness across 2 to 22 keV to identify giant X-class flares that can trigger space storms."}
            </p>
            <div className="mt-2 pt-4 border-t border-border/60 text-xs text-muted-foreground space-y-2">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-mono text-foreground font-semibold">Sun-Earth L1 Lagrange Point</span>
              </div>
              <div className="flex justify-between">
                <span>Early Warning Lead Time:</span>
                <span className="font-mono text-primary font-semibold">30 to 60 Minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Data Source:</span>
                <span className="font-mono text-accent">ISRO ISSDC / Zenodo Open Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
