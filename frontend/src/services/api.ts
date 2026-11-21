import {
  MissionEstimateRequest,
  MissionEstimateResponse,
  StormScenarioRequest,
  StormScenarioResponse,
  ShieldingComparisonResponse,
  SpaceWeatherTelemetry,
  AdityaL1Telemetry,
  ModelAssumptionsResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchHealth(): Promise<{ status: string; version: string }> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchSpaceWeather(): Promise<SpaceWeatherTelemetry> {
  const res = await fetch(`${API_BASE_URL}/api/weather/live`);
  if (!res.ok) throw new Error(`Space weather query failed: ${res.statusText}`);
  return res.json();
}

export async function estimateMissionDose(req: MissionEstimateRequest): Promise<MissionEstimateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/mission/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Mission estimation failed: ${res.statusText}`);
  return res.json();
}

export async function simulateStormScenario(req: StormScenarioRequest): Promise<StormScenarioResponse> {
  const res = await fetch(`${API_BASE_URL}/api/mission/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Storm simulation failed: ${res.statusText}`);
  return res.json();
}

export async function fetchShieldingComparison(): Promise<ShieldingComparisonResponse> {
  const res = await fetch(`${API_BASE_URL}/api/shelter/compare`);
  if (!res.ok) throw new Error(`Shielding comparison fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchAdityaL1Data(): Promise<AdityaL1Telemetry> {
  const res = await fetch(`${API_BASE_URL}/api/aditya-l1`);
  if (!res.ok) throw new Error(`Aditya-L1 fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchModelAssumptions(): Promise<ModelAssumptionsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/assumptions`);
  if (!res.ok) throw new Error(`Model assumptions fetch failed: ${res.statusText}`);
  return res.json();
}

