import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend
} from 'recharts';
import { MissionEstimateResponse, StormScenarioResponse } from '../types';

interface DoseTimelineProps {
  estimate: MissionEstimateResponse | null;
  stormScenario: StormScenarioResponse | null;
  loading: boolean;
}

export const DoseTimeline: React.FC<DoseTimelineProps> = ({
  estimate,
  stormScenario,
  loading,
}) => {
  if (loading || !estimate) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 min-h-[380px] flex items-center justify-center">
        <span className="font-mono text-xs text-muted-foreground animate-pulse">Calculating trajectory dose integration...</span>
      </div>
    );
  }

  const data = stormScenario
    ? stormScenario.timeline_no_shelter.map((pt, idx) => {
        const shelterPt = stormScenario.timeline_with_shelter[idx] || pt;
        return {
          day: pt.day,
          cumulative_effective: pt.cumulative_effective_dose,
          cumulative_dose_equiv: pt.cumulative_dose_equivalent,
          storm_no_shelter_e: pt.cumulative_effective_dose,
          storm_with_shelter_e: shelterPt.cumulative_effective_dose,
          low: pt.cumulative_low,
          high: pt.cumulative_high,
        };
      })
    : estimate.timeline.map((pt) => ({
        day: pt.day,
        cumulative_effective: pt.cumulative_effective_dose,
        cumulative_dose_equiv: pt.cumulative_dose_equivalent,
        low: pt.cumulative_low,
        high: pt.cumulative_high,
      }));

  const maxDose = Math.max(
    estimate.total_high_msv,
    stormScenario ? stormScenario.total_no_shelter_effective_msv : 0,
    650
  );

  return (
    <div className="rounded-lg border border-border bg-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-border/60 gap-2">
          <div>
            <h3 className="font-medium text-sm text-foreground">Mission Radiation Buildup Over Time</h3>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Watch radiation climb day-by-day. Keep the line below the red NASA safety limit!
            </p>
          </div>

          {stormScenario && (
            <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-destructive/40 bg-destructive/10 text-destructive">
              Solar Storm ({stormScenario.storm_class}) on Day {stormScenario.storm_day}
            </span>
          )}
        </div>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#242f3d" vertical={false} />

              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={11}
                fontFamily="IBM Plex Mono"
                tickLine={false}
                label={{ value: 'Days in space', position: 'insideBottom', offset: -10, fill: '#f8fafc', fontSize: 12, fontWeight: 500 }}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                fontFamily="IBM Plex Mono"
                tickLine={false}
                domain={[0, Math.ceil(maxDose / 50) * 50]}
                label={{ value: 'Radiation Dose (mSv)', angle: -90, position: 'insideLeft', offset: 16, fill: '#f8fafc', fontSize: 12, fontWeight: 600 }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const p = payload[0].payload;
                    return (
                      <div className="rounded-md border border-border bg-popover p-3 font-mono text-xs shadow-xl space-y-1">
                        <div className="text-muted-foreground mb-1">Day {label} in Space</div>
                        {stormScenario ? (
                          <>
                            <div className="text-destructive font-semibold">Without Bunker: {p.storm_no_shelter_e} mSv</div>
                            <div className="text-accent font-semibold">With Storm Bunker: {p.storm_with_shelter_e} mSv</div>
                          </>
                        ) : (
                          <>
                            <div className="text-primary font-semibold">Body Absorbed (E): {p.cumulative_effective} mSv</div>
                            <div className="text-muted-foreground text-[10px]">Raw Sensor (H): {p.cumulative_dose_equiv} mSv</div>
                            <div className="text-muted-foreground text-[10px]">Expected Range: {p.low} – {p.high} mSv</div>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px', fontFamily: 'Inter' }} />

              <ReferenceLine
                y={600}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: 'NASA Lifetime Limit (600 mSv)', fill: '#f43f5e', fontSize: 10, position: 'right' }}
              />
              <ReferenceLine
                y={250}
                stroke="#38bdf8"
                strokeDasharray="4 4"
                label={{ value: 'NASA 30-Day Limit (250 mSv)', fill: '#38bdf8', fontSize: 10, position: 'right' }}
              />

              {!stormScenario && (
                <>
                  <Area
                    name="Confidence bound"
                    type="monotone"
                    dataKey="high"
                    stroke="none"
                    fill="#38bdf8"
                    fillOpacity={0.07}
                  />
                  <Area
                    name="Effective Dose (E)"
                    type="monotone"
                    dataKey="cumulative_effective"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#cyanGradient)"
                  />
                </>
              )}

              {stormScenario && (
                <>
                  <Line
                    name="Without shelter (mSv E)"
                    type="stepAfter"
                    dataKey="storm_no_shelter_e"
                    stroke="#f14d4c"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    name="With dedicated shelter (mSv E)"
                    type="stepAfter"
                    dataKey="storm_with_shelter_e"
                    stroke="#58d1e5"
                    strokeWidth={2}
                    dot={false}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>NASA-STD-3001 Rev C &amp; MSL RAD calibration</span>
        <span>Daily effective rate: <strong className="text-primary font-semibold">{estimate.daily_effective_dose_rate_msv} mSv/d</strong></span>
      </div>
    </div>
  );
};
