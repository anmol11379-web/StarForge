import React from 'react';
import { Activity, Sun, Zap, ShieldAlert, WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';
import { SpaceWeatherTelemetry } from '../types';
import { HelpBadge } from './HelpBadge';

interface SpaceWeatherPanelProps {
  weather: SpaceWeatherTelemetry | null;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export const SpaceWeatherPanel: React.FC<SpaceWeatherPanelProps> = ({ weather, loading, error, onRefresh }) => {
  return (
    <section aria-labelledby="live-weather-heading" className="rounded-lg border border-border bg-card/80 backdrop-blur transition-all">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <h2 id="live-weather-heading" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span className="relative flex size-2 items-center justify-center shrink-0" aria-hidden="true">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  weather?.is_cached ? 'bg-primary' : 'bg-accent'
                }`}
              />
              <span
                className={`relative inline-flex size-2 rounded-full animate-blink ${
                  weather?.is_cached ? 'bg-primary shadow-[0_0_8px_#38bdf8]' : 'bg-accent shadow-[0_0_8px_#2dd4bf]'
                }`}
              />
            </span>
            <span>Live Space Weather Right Now · NOAA Satellites</span>
          </h2>

          {weather?.is_cached ? (
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-secondary text-primary flex items-center gap-1">
              <WifiOff className="size-3" />
              <span>Verified Space Snapshot</span>
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-accent/40 bg-accent/10 text-accent flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              <span>Live Space Data</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {loading
              ? 'Talking to space satellites...'
              : weather?.last_updated
              ? `Updated ${new Date(weather.last_updated).toLocaleTimeString()}`
              : 'Connecting to space radar...'}
          </span>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              title="Click to refresh live space weather from NOAA satellites"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-secondary/80 hover:bg-secondary text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
            >
              <span className="relative flex size-2 items-center justify-center shrink-0">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    weather?.is_cached ? 'bg-primary' : 'bg-accent'
                  }`}
                />
                <span
                  className={`relative inline-flex size-1.5 rounded-full animate-blink ${
                    weather?.is_cached ? 'bg-primary shadow-[0_0_6px_#38bdf8]' : 'bg-accent shadow-[0_0_6px_#2dd4bf]'
                  }`}
                />
              </span>
              <span className="font-semibold text-foreground">
                {weather ? (weather.is_cached ? 'CACHED' : 'LIVE') : 'RADAR'}
              </span>
              <RefreshCw
                className={`size-2.5 text-muted-foreground ${
                  loading ? 'animate-spin text-accent' : ''
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="px-5 py-2.5 bg-secondary/50 border-b border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>Signal interrupted: showing verified space weather snapshot.</span>
        </div>
      )}

      {/* 4 Metric Columns via Definition List */}
      <dl className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        
        {/* Metric 1: Proton Flux */}
        <div className="flex flex-col bg-card p-5 relative">
          <dt className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HelpBadge term="proton_flux" placement="top" align="left" />
              <span>Flying Space Protons</span>
            </span>
            <Zap className="size-4 text-accent" />
          </dt>
          <dd className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              {weather ? weather.proton_flux_gt_10mev.toFixed(2) : '--'}
            </span>
            <span className="font-mono text-xs text-muted-foreground">particles/sec</span>
          </dd>
          <dd className="mt-1 font-mono text-[11px] text-muted-foreground">
            &gt;100 MeV fast rays: <span className="text-foreground">{weather ? weather.proton_flux_gt_100mev.toFixed(3) : '--'}</span>
          </dd>
        </div>

        {/* Metric 2: Planetary Kp Index */}
        <div className="flex flex-col bg-card p-5 relative">
          <dt className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HelpBadge term="kp_index" placement="top" align="left" />
              <span>Magnetic Storm (Kp)</span>
            </span>
            <Activity className="size-4 text-primary" />
          </dt>
          <dd className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              {weather ? weather.kp_index.toFixed(1) : '--'}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {weather && weather.kp_index >= 5 ? 'Stormy!' : 'All Calm'}
            </span>
          </dd>
          <dd className="mt-2 w-full bg-secondary h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${weather && weather.kp_index >= 5 ? 'bg-destructive' : 'bg-accent'}`}
              style={{ width: `${Math.min(100, ((weather?.kp_index || 0) / 9) * 100)}%` }}
            />
          </dd>
        </div>

        {/* Metric 3: GOES Solar X-Ray Flux */}
        <div className="flex flex-col bg-card p-5 relative">
          <dt className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HelpBadge term="solar_flare" placement="top" align="right" />
              <span>Sun Flare Power</span>
            </span>
            <Sun className="size-4 text-primary" />
          </dt>
          <dd className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight text-primary">
              {weather?.flare_class || 'C1.2'}
            </span>
            <span className="font-mono text-xs text-muted-foreground">flare size</span>
          </dd>
          <dd className="mt-1 font-mono text-[11px] text-muted-foreground">
            X-ray brightness level
          </dd>
        </div>

        {/* Metric 4: NOAA Radiation Storm Scale */}
        <div className="flex flex-col bg-card p-5 relative">
          <dt className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HelpBadge term="noaa_s_scale" placement="top" align="right" />
              <span>Storm Danger (S-Scale)</span>
            </span>
            <ShieldAlert className="size-4 text-accent" />
          </dt>
          <dd className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              {weather?.noaa_s_scale || 'S0'}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {weather?.noaa_s_scale === 'S0' ? 'Quiet' : 'Alert'}
            </span>
          </dd>
          <dd className="mt-1 text-xs text-muted-foreground truncate">
            {weather?.status_summary || 'Sun is calm and peaceful'}
          </dd>
        </div>

      </dl>
    </section>
  );
};
