"""
Pydantic Schemas for AstroShield Request and Response Payloads
"""

from typing import List, Dict, Any
from pydantic import BaseModel, Field

class MissionEstimateRequest(BaseModel):
    destination: str = Field(
        default="mars_transit",
        description="Destination phase: 'lunar_orbit', 'lunar_surface', 'mars_transit', or 'mars_surface'"
    )
    duration_days: int = Field(default=180, ge=1, le=1200, description="Mission duration in Earth days")
    crew_size: int = Field(default=4, ge=1, le=12, description="Number of astronauts in crew")
    shielding_areal_density: float = Field(
        default=20.0,
        ge=1.0,
        le=150.0,
        description="Physical areal density of chosen material in g/cm² (avoiding Al-equivalent approximation)"
    )
    shielding_material: str = Field(
        default="aluminium",
        description="Primary material: 'aluminium', 'polyethylene', 'water', or 'regolith'"
    )
    solar_cycle_phase: str = Field(
        default="solar_moderate",
        description="'solar_min', 'solar_moderate', or 'solar_max'"
    )

class DailyDosePoint(BaseModel):
    day: int
    cumulative_dose_equivalent: float
    cumulative_effective_dose: float
    # Backward compatibility alias
    cumulative_expected: float
    cumulative_low: float
    cumulative_high: float
    daily_rate: float

class MissionEstimateResponse(BaseModel):
    destination: str
    duration_days: int
    crew_size: int
    shielding_areal_density: float
    shielding_material: str
    solar_cycle_phase: str
    
    # Dose Equivalent (H, mSv - MSL RAD detector quantity)
    total_dose_equivalent_msv: float
    total_low_msv: float
    total_high_msv: float
    daily_dose_equivalent_rate_msv: float
    
    # Effective Dose (E = H * 0.65, mSv - for NASA 600 mSv career limit)
    total_effective_dose_msv: float
    daily_effective_dose_rate_msv: float
    dose_equivalent_to_effective_ratio: float
    
    # Backward compatibility alias
    total_expected_msv: float
    daily_gcr_rate_msv: float
    
    # Percentage of NASA-STD-3001 Rev C Limits (evaluated on Effective Dose)
    career_limit_pct: float
    one_year_limit_pct: float
    thirty_day_limit_pct: float
    
    # Risk Classification
    risk_level: str
    risk_reason: str
    clinical_note: str
    
    # Timeline points
    timeline: List[DailyDosePoint]
    
    # Physics note
    shielding_efficiency_note: str
    disclaimer: str

class StormScenarioRequest(BaseModel):
    destination: str = Field(default="mars_transit")
    duration_days: int = Field(default=180, ge=1, le=1200)
    baseline_shielding: float = Field(default=10.0, ge=1.0, le=100.0, description="Base hull shielding in g/cm²")
    storm_day: int = Field(default=45, ge=1, le=1200, description="Mission day on which SEP storm arrives")
    storm_class: str = Field(default="S3", description="NOAA storm class: 'S1', 'S2', 'S3', 'S4', or 'S5'")
    shelter_shielding: float = Field(default=35.0, ge=10.0, le=150.0, description="Storm shelter areal density in g/cm²")
    shelter_material: str = Field(default="polyethylene", description="Storm shelter material")

class StormScenarioResponse(BaseModel):
    destination: str
    duration_days: int
    storm_day: int
    storm_class: str
    
    # Background GCR total without storm
    background_gcr_dose_equivalent_msv: float
    background_gcr_effective_dose_msv: float
    background_gcr_msv: float # alias
    
    # Storm SEP acute dose (dose equivalent and effective)
    spe_unshielded_dose_msv: float
    spe_no_shelter_dose_equiv_msv: float
    spe_no_shelter_effective_msv: float
    spe_with_shelter_dose_equiv_msv: float
    spe_with_shelter_effective_msv: float
    
    # Backward compatibility aliases
    spe_no_shelter_dose_msv: float
    spe_with_shelter_dose_msv: float
    total_without_shelter_msv: float
    total_with_shelter_msv: float
    
    # Cumulative mission totals with storm
    total_no_shelter_effective_msv: float
    total_with_shelter_effective_msv: float
    dose_saved_effective_msv: float
    dose_saved_msv: float # alias
    reduction_percentage: float
    
    # Risk assessments (based on effective dose)
    risk_without_shelter: str
    risk_with_shelter: str
    why_explanation: str
    recommendation: str
    
    # Timeline
    timeline_no_shelter: List[DailyDosePoint]
    timeline_with_shelter: List[DailyDosePoint]

class ShieldingMaterialComparisonPoint(BaseModel):
    areal_density: float
    aluminium_dose: float
    polyethylene_dose: float
    water_dose: float
    regolith_dose: float

class ShieldingComparisonResponse(BaseModel):
    description: str
    datapoints: List[ShieldingMaterialComparisonPoint]
    insights: List[str]

class SpaceWeatherTelemetry(BaseModel):
    source: str
    is_cached: bool
    last_updated: str
    proton_flux_gt_10mev: float
    proton_flux_gt_100mev: float
    kp_index: float
    noaa_s_scale: str
    noaa_s_scale_num: int
    flare_class: str
    status_summary: str
    storm_alert: bool
    recent_proton_series: List[Dict[str, Any]]
    recent_kp_series: List[Dict[str, Any]]

class AdityaL1Telemetry(BaseModel):
    source: str
    satellite: str
    orbit: str
    is_preloaded: bool
    label: str
    reference_event: str
    description: str
    timestamp_range: str
    aspex_proton_datapoints: List[Dict[str, Any]]
    solexs_xray_datapoints: List[Dict[str, Any]]
    # Legacy alias
    datapoints: List[Dict[str, Any]]
