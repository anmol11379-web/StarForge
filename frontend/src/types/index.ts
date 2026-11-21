export interface DailyDosePoint {
  day: number;
  cumulative_dose_equivalent: number;
  cumulative_effective_dose: number;
  cumulative_expected: number;
  cumulative_low: number;
  cumulative_high: number;
  daily_rate: number;
}

export interface MissionEstimateRequest {
  destination: string;
  duration_days: number;
  crew_size: number;
  shielding_areal_density: number;
  shielding_material: string;
  solar_cycle_phase: string;
}

export interface MissionEstimateResponse {
  destination: string;
  duration_days: number;
  crew_size: number;
  shielding_areal_density: number;
  shielding_material: string;
  solar_cycle_phase: string;
  
  // Dose Equivalent (H, mSv - detector quantity)
  total_dose_equivalent_msv: number;
  total_low_msv: number;
  total_high_msv: number;
  daily_dose_equivalent_rate_msv: number;
  
  // Effective Dose (E = H * 0.65, mSv - compared to NASA limits)
  total_effective_dose_msv: number;
  daily_effective_dose_rate_msv: number;
  dose_equivalent_to_effective_ratio: number;
  
  // Legacy aliases
  total_expected_msv: number;
  daily_gcr_rate_msv: number;
  
  // Percentage of NASA-STD-3001 Rev C Limits
  career_limit_pct: number;
  one_year_limit_pct: number;
  thirty_day_limit_pct: number;
  
  // Risk Classification
  risk_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  risk_reason: string;
  clinical_note: string;
  timeline: DailyDosePoint[];
  shielding_efficiency_note: string;
  disclaimer: string;
}

export interface StormScenarioRequest {
  destination: string;
  duration_days: number;
  baseline_shielding: number;
  storm_day: number;
  storm_class: string;
  shelter_shielding: number;
  shelter_material: string;
}

export interface StormScenarioResponse {
  destination: string;
  duration_days: number;
  storm_day: number;
  storm_class: string;
  background_gcr_dose_equivalent_msv: number;
  background_gcr_effective_dose_msv: number;
  background_gcr_msv: number;
  spe_unshielded_dose_msv: number;
  spe_no_shelter_dose_equiv_msv: number;
  spe_no_shelter_effective_msv: number;
  spe_with_shelter_dose_equiv_msv: number;
  spe_with_shelter_effective_msv: number;
  spe_no_shelter_dose_msv: number;
  spe_with_shelter_dose_msv: number;
  total_without_shelter_msv: number;
  total_with_shelter_msv: number;
  total_no_shelter_effective_msv: number;
  total_with_shelter_effective_msv: number;
  dose_saved_effective_msv: number;
  dose_saved_msv: number;
  reduction_percentage: number;
  risk_without_shelter: 'Low' | 'Moderate' | 'High' | 'Critical';
  risk_with_shelter: 'Low' | 'Moderate' | 'High' | 'Critical';
  why_explanation: string;
  recommendation: string;
  timeline_no_shelter: DailyDosePoint[];
  timeline_with_shelter: DailyDosePoint[];
}

export interface ShieldingMaterialComparisonPoint {
  areal_density: number;
  aluminium_dose: number;
  polyethylene_dose: number;
  water_dose: number;
  regolith_dose: number;
}

export interface ShieldingComparisonResponse {
  description: string;
  datapoints: ShieldingMaterialComparisonPoint[];
  insights: string[];
}

export interface SpaceWeatherTelemetry {
  source: string;
  is_cached: boolean;
  last_updated: string;
  proton_flux_gt_10mev: number;
  proton_flux_gt_100mev: number;
  kp_index: number;
  noaa_s_scale: string;
  noaa_s_scale_num: number;
  flare_class: string;
  status_summary: string;
  storm_alert: boolean;
  recent_proton_series: { time: string; flux: number; energy: string }[];
  recent_kp_series: { time: string; kp: number }[];
}

export interface AdityaL1Telemetry {
  source: string;
  satellite: string;
  orbit: string;
  is_preloaded: boolean;
  label: string;
  reference_event: string;
  description: string;
  timestamp_range: string;
  aspex_proton_datapoints: {
    timestamp: string;
    aspex_steps_flux: number;
    noaa_goes_proton_flux: number;
    solar_wind_speed_kms: number;
  }[];
  solexs_xray_datapoints: {
    timestamp: string;
    solexs_counts_sec: number;
    noaa_goes_xray_flux: number;
    flare_class: string;
  }[];
  datapoints: {
    timestamp: string;
    steps_proton_flux: number;
    noaa_goes_flux: number;
    solexs_xray_flux: number;
    solar_wind_speed_kms: number;
  }[];
}

export interface ModelAssumptionsResponse {
  disclaimer: string;
  dose_equivalent_to_effective_ratio: number;
  baseline_gcr_rates_msv_day: Record<string, number>;
  solar_modulation_factors: Record<string, number>;
  material_properties: Record<string, any>;
  nasa_limits: Record<string, number>;
  noaa_s_scale_table: Record<string, any>;
  risk_level_definitions: Record<string, any>;
  citations: string[];
}
