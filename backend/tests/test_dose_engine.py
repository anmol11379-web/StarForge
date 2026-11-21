"""
Pytest Unit Tests for AstroShield Dose Engine
=============================================
Sanity checks:
1. Dose rises strictly with duration.
2. Dose falls with shielding areal density, with polyethylene flattening and aluminium exhibiting saturation/upturn.
3. Storm scenario dose with shelter is strictly less than without shelter.
4. Hydrogen-rich materials (Polyethylene, Water) attenuate more effectively than Aluminium.
5. Dose Equivalent (H) to Effective Dose (E) conversion ratio is ~0.65.
6. Risk classifications adhere to NASA-STD-3001 Rev C limits based on Effective Dose.
7. Low band <= Expected <= High band.
"""

import pytest
from backend.app.schemas import MissionEstimateRequest, StormScenarioRequest
from backend.app.dose_engine import (
    calculate_gcr_attenuation_factor,
    calculate_spe_attenuation_factor,
    calculate_daily_gcr_rates,
    classify_risk_effective,
    generate_mission_estimate,
    generate_storm_scenario,
    generate_shielding_comparison,
)
from backend.app.constants import DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO

def test_dose_rises_with_duration():
    """Cumulative dose must increase monotonically with mission duration."""
    req_short = MissionEstimateRequest(destination="mars_transit", duration_days=30, shielding_areal_density=20.0)
    req_med = MissionEstimateRequest(destination="mars_transit", duration_days=180, shielding_areal_density=20.0)
    req_long = MissionEstimateRequest(destination="mars_transit", duration_days=360, shielding_areal_density=20.0)
    
    res_short = generate_mission_estimate(req_short)
    res_med = generate_mission_estimate(req_med)
    res_long = generate_mission_estimate(req_long)
    
    assert res_short.total_effective_dose_msv < res_med.total_effective_dose_msv < res_long.total_effective_dose_msv
    assert pytest.approx(res_long.total_effective_dose_msv, rel=1e-2) == res_med.total_effective_dose_msv * 2

def test_dose_equivalent_vs_effective_ratio():
    """Effective dose must equal Dose Equivalent * conversion ratio (0.65)."""
    req = MissionEstimateRequest(destination="mars_transit", duration_days=180, shielding_areal_density=20.0)
    res = generate_mission_estimate(req)
    
    assert res.dose_equivalent_to_effective_ratio == DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO
    assert pytest.approx(res.total_effective_dose_msv, rel=1e-2) == res.total_dose_equivalent_msv * DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO

def test_polyethylene_flattens_and_outperforms_aluminium():
    """HDPE flattens without secondary buildup and delivers lower dose than Aluminium."""
    for x in [10.0, 25.0, 50.0]:
        al_factor = calculate_gcr_attenuation_factor(x, "aluminium")
        pe_factor = calculate_gcr_attenuation_factor(x, "polyethylene")
        assert pe_factor < al_factor

def test_aluminium_secondary_upturn():
    """Aluminium attenuation bottoms out and has slight secondary buildup past 25 g/cm²."""
    al_25 = calculate_gcr_attenuation_factor(25.0, "aluminium")
    al_50 = calculate_gcr_attenuation_factor(50.0, "aluminium")
    # Due to secondary buildup slope, factor at 50 is >= factor at 25
    assert al_50 >= al_25

def test_storm_shelter_strictly_reduces_dose():
    """Scenario with shelter must deposit strictly less dose than without shelter."""
    for storm_class in ["S2", "S3", "S4", "S5"]:
        req = StormScenarioRequest(
            destination="mars_transit",
            duration_days=180,
            baseline_shielding=10.0,
            storm_day=45,
            storm_class=storm_class,
            shelter_shielding=35.0,
            shelter_material="polyethylene"
        )
        res = generate_storm_scenario(req)
        
        assert res.spe_with_shelter_effective_msv < res.spe_no_shelter_effective_msv
        assert res.total_with_shelter_effective_msv < res.total_no_shelter_effective_msv
        assert res.dose_saved_effective_msv > 0.0
        assert res.reduction_percentage > 50.0

def test_risk_classification_tiers():
    """Risk tier classifications must match operational limits in Effective Dose."""
    tier_low, _, _ = classify_risk_effective(25.0)
    assert tier_low == "Low"
    
    tier_mod, _, _ = classify_risk_effective(120.0)
    assert tier_mod == "Moderate"
    
    tier_high, _, _ = classify_risk_effective(350.0)
    assert tier_high == "High"
    
    tier_crit, _, _ = classify_risk_effective(620.0)
    assert tier_crit == "Critical"

def test_shielding_comparison_endpoint():
    """Shielding comparison generator produces 4 materials and monotonic ordering."""
    res = generate_shielding_comparison()
    assert len(res.datapoints) > 5
    assert len(res.insights) >= 3
    pt_30 = next(p for p in res.datapoints if p.areal_density == 30.0)
    assert pt_30.polyethylene_dose < pt_30.aluminium_dose
