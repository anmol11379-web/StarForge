"""
AstroShield Pure Dose Engine
============================
Encapsulates radiological transport equations for:
1. GCR background dose equivalent (H) and effective dose (E).
2. Non-linear shielding attenuation with material saturation floor and aluminium secondary buildup.
3. SPE (Solar Particle Event) acute fluence and storm shelter attenuation.
4. Compliance verification against NASA-STD-3001 Vol 1 Rev C (2023) limits.

All physics functions are deterministic, unit-tested, and physically calibrated.
"""

import math
from typing import List, Tuple
from backend.app.constants import (
    BASELINE_GCR_RATES_MSV_DAY,
    SOLAR_MODULATION_FACTORS,
    MATERIAL_PROPERTIES,
    NASA_LIMITS,
    NOAA_S_SCALE_TABLE,
    RISK_LEVEL_DEFINITIONS,
    DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO,
    DISCLAIMER,
)
from backend.app.schemas import (
    MissionEstimateRequest,
    MissionEstimateResponse,
    DailyDosePoint,
    StormScenarioRequest,
    StormScenarioResponse,
    ShieldingMaterialComparisonPoint,
    ShieldingComparisonResponse,
)

def calculate_gcr_attenuation_factor(areal_density: float, material_key: str = "aluminium") -> float:
    """
    Computes GCR attenuation fraction using the saturated transport form:
    factor = floor + (1 - floor) * exp(-x / lambda) + buildup(x)
    
    Physics:
    - Pure exponential attenuation is inadequate for GCR because high-Z and energy (HZE)
      ions undergo nuclear fragmentation into secondary neutrons and lighter fragments.
    - Polyethylene (HDPE) and Water (H2O) flatten asymptotically towards a low saturation floor
      without secondary upturn because light hydrogen nuclei stop protons efficiently with minimal fragmentation.
    - Aluminium (Al-6061) bottoms out around 20-30 g/cm² and subsequently exhibits a slight
      upturn in dose equivalent from secondary neutron and particle buildup.
    - Regolith sits between aluminium and hydrogenous shields.
    
    Returns:
        Transmission factor (0.0 < factor <= 1.0)
    """
    x = max(0.0, float(areal_density))
    mat = MATERIAL_PROPERTIES.get(material_key, MATERIAL_PROPERTIES["aluminium"])
    
    floor = mat["floor"]
    lam = mat["lambda_g_cm2"]
    
    # Exponential transition to floor
    base_factor = floor + (1.0 - floor) * math.exp(-x / lam)
    
    # Secondary particle buildup for high-Z metals (Aluminium) past ~25 g/cm²
    buildup = 0.0
    if mat.get("has_secondary_upturn", False):
        threshold = mat.get("upturn_threshold_g_cm2", 25.0)
        slope = mat.get("upturn_slope", 0.0018)
        if x > threshold:
            buildup = slope * (x - threshold)
            
    factor = min(1.0, base_factor + buildup)
    return factor

def calculate_spe_attenuation_factor(areal_density: float, material_key: str = "polyethylene") -> float:
    """
    Computes Solar Particle Event (SPE) proton transmission through shielding.
    SPE is dominated by 10-150 MeV protons governed by Bethe-Bloch Coulomb deceleration.
    """
    x = max(0.0, float(areal_density))
    mat = MATERIAL_PROPERTIES.get(material_key, MATERIAL_PROPERTIES["polyethylene"])
    mu = mat["spe_attenuation_coeff"]
    return math.exp(-mu * x)

def calculate_daily_gcr_rates(
    destination: str,
    areal_density: float,
    material_key: str = "aluminium",
    solar_cycle_phase: str = "solar_moderate"
) -> Tuple[float, float]:
    """
    Returns (daily_dose_equivalent_msv, daily_effective_dose_msv).
    Dose Equivalent (H) is the quantity measured by MSL RAD.
    Effective Dose (E = H * 0.65) is the organ-weighted quantity for NASA-STD-3001 limits.
    """
    base_rate_equiv = BASELINE_GCR_RATES_MSV_DAY.get(destination, BASELINE_GCR_RATES_MSV_DAY["mars_transit"])
    mod_factor = SOLAR_MODULATION_FACTORS.get(solar_cycle_phase, 1.10)
    shield_factor = calculate_gcr_attenuation_factor(areal_density, material_key)
    
    daily_h = round(base_rate_equiv * mod_factor * shield_factor, 4)
    daily_e = round(daily_h * DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO, 4)
    return daily_h, daily_e

def classify_risk_effective(total_effective_msv: float) -> Tuple[str, str, str]:
    """
    Maps cumulative Effective Dose (E, mSv) to NASA operational risk tier.
    NASA-STD-3001 Rev C limits are specified in Effective Dose (600 mSv career PEL).
    """
    if total_effective_msv < 50.0:
        info = RISK_LEVEL_DEFINITIONS["Low"]
        return (
            "Low",
            f"All Good & Safe! The total dose of {total_effective_msv:.1f} mSv is way below NASA's limits.",
            info["clinical_note"]
        )
    elif total_effective_msv <= 250.0:
        info = RISK_LEVEL_DEFINITIONS["Moderate"]
        return (
            "Moderate",
            f"Caution! The total dose of {total_effective_msv:.1f} mSv is getting close to NASA's 30-day limit (250 mSv), using {(total_effective_msv / NASA_LIMITS['career_effective'] * 100):.1f}% of their lifetime budget.",
            info["clinical_note"]
        )
    elif total_effective_msv <= 500.0:
        info = RISK_LEVEL_DEFINITIONS["High"]
        return (
            "High",
            f"Danger Zone! Total dose of {total_effective_msv:.1f} mSv passed NASA's 30-day safety limit (250 mSv) and used {(total_effective_msv / NASA_LIMITS['career_effective'] * 100):.1f}% of their lifetime budget.",
            info["clinical_note"]
        )
    else:
        info = RISK_LEVEL_DEFINITIONS["Critical"]
        return (
            "Critical",
            f"Emergency Alert! Total dose of {total_effective_msv:.1f} mSv is dangerously high and threatens the 600 mSv NASA lifetime limit.",
            info["clinical_note"]
        )

def generate_mission_estimate(req: MissionEstimateRequest) -> MissionEstimateResponse:
    """
    Computes cumulative GCR dose equivalent (H) and effective dose (E),
    low/expected/high confidence bands, and NASA-STD-3001 Rev C limit margins.
    """
    daily_h, daily_e = calculate_daily_gcr_rates(
        destination=req.destination,
        areal_density=req.shielding_areal_density,
        material_key=req.shielding_material,
        solar_cycle_phase=req.solar_cycle_phase
    )
    
    total_h = round(daily_h * req.duration_days, 2)
    total_e = round(daily_e * req.duration_days, 2)
    
    total_low_e = round(total_e * 0.82, 2)
    total_high_e = round(total_e * 1.22, 2)
    
    career_pct = round((total_e / NASA_LIMITS["career_effective"]) * 100, 1)
    one_year_pct = round((total_e / NASA_LIMITS["one_year_effective"]) * 100, 1)
    thirty_day_pct = round((total_e / NASA_LIMITS["thirty_day_effective"]) * 100, 1)
    
    risk_level, risk_reason, clinical_note = classify_risk_effective(total_e)
    
    # Timeline generation
    step = max(1, req.duration_days // 50)
    timeline: List[DailyDosePoint] = []
    days = list(range(0, req.duration_days + 1, step))
    if days[-1] != req.duration_days:
        days.append(req.duration_days)
        
    for d in days:
        cum_h = round(daily_h * d, 2)
        cum_e = round(daily_e * d, 2)
        timeline.append(DailyDosePoint(
            day=d,
            cumulative_dose_equivalent=cum_h,
            cumulative_effective_dose=cum_e,
            cumulative_expected=cum_e,
            cumulative_low=round(cum_e * 0.82, 2),
            cumulative_high=round(cum_e * 1.22, 2),
            daily_rate=daily_e
        ))
        
    mat_info = MATERIAL_PROPERTIES.get(req.shielding_material, MATERIAL_PROPERTIES["aluminium"])
    trans = calculate_gcr_attenuation_factor(req.shielding_areal_density, req.shielding_material)
    efficiency_note = (
        f"{mat_info['name']} areal density {req.shielding_areal_density:.1f} g/cm² yields a transmission factor of {trans:.2f}. "
        f"{mat_info['description']}"
    )
    
    return MissionEstimateResponse(
        destination=req.destination,
        duration_days=req.duration_days,
        crew_size=req.crew_size,
        shielding_areal_density=req.shielding_areal_density,
        shielding_material=req.shielding_material,
        solar_cycle_phase=req.solar_cycle_phase,
        total_dose_equivalent_msv=total_h,
        total_effective_dose_msv=total_e,
        daily_dose_equivalent_rate_msv=daily_h,
        daily_effective_dose_rate_msv=daily_e,
        dose_equivalent_to_effective_ratio=DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO,
        total_expected_msv=total_e,
        daily_gcr_rate_msv=daily_e,
        total_low_msv=total_low_e,
        total_high_msv=total_high_e,
        career_limit_pct=career_pct,
        one_year_limit_pct=one_year_pct,
        thirty_day_limit_pct=thirty_day_pct,
        risk_level=risk_level,
        risk_reason=risk_reason,
        clinical_note=clinical_note,
        timeline=timeline,
        shielding_efficiency_note=efficiency_note,
        disclaimer=DISCLAIMER,
    )

def generate_storm_scenario(req: StormScenarioRequest) -> StormScenarioResponse:
    """
    Simulates acute SPE proton fluence on day N and evaluates whole-body dose
    with and without dedicated storm shelter refuge.
    """
    daily_h, daily_e = calculate_daily_gcr_rates(
        destination=req.destination,
        areal_density=req.baseline_shielding,
        material_key="aluminium",
        solar_cycle_phase="solar_moderate"
    )
    total_gcr_h = round(daily_h * req.duration_days, 2)
    total_gcr_e = round(daily_e * req.duration_days, 2)
    
    storm_info = NOAA_S_SCALE_TABLE.get(req.storm_class, NOAA_S_SCALE_TABLE["S3"])
    unshielded_spe = storm_info["typical_spe_unshielded_dose_msv"]
    
    # SPE transmission through baseline hull vs dedicated shelter
    base_trans = calculate_spe_attenuation_factor(req.baseline_shielding, "aluminium")
    shelter_trans = calculate_spe_attenuation_factor(req.shelter_shielding, req.shelter_material)
    
    spe_no_shelter_h = round(unshielded_spe * base_trans, 2)
    spe_with_shelter_h = round(unshielded_spe * shelter_trans, 2)
    
    # For solar protons, mean effective dose ratio is ~0.70 per ICRP 123
    spe_no_shelter_e = round(spe_no_shelter_h * 0.70, 2)
    spe_with_shelter_e = round(spe_with_shelter_h * 0.70, 2)
    
    total_no_shelter_e = round(total_gcr_e + spe_no_shelter_e, 2)
    total_with_shelter_e = round(total_gcr_e + spe_with_shelter_e, 2)
    dose_saved_e = round(total_no_shelter_e - total_with_shelter_e, 2)
    
    reduction_pct = 0.0
    if spe_no_shelter_e > 0:
        reduction_pct = round(((spe_no_shelter_e - spe_with_shelter_e) / spe_no_shelter_e) * 100, 1)
        
    risk_no_shelter, _, _ = classify_risk_effective(total_no_shelter_e)
    risk_with_shelter, _, _ = classify_risk_effective(total_with_shelter_e)
    
    why_explanation = (
        f"A {req.storm_class} solar storm strikes on Day {req.storm_day}! "
        f"Without an emergency bunker, astronauts take a heavy blast of {spe_no_shelter_e:.1f} mSv through regular spaceship walls. "
        f"Inside the {req.shelter_shielding:.0f} g/cm² {req.shelter_material} storm shelter, "
        f"the radiation blast drops to just {spe_with_shelter_e:.1f} mSv ({reduction_pct}% of the storm blocked!). "
        f"Special hydrogen-rich materials (like plastic or water) act like soft pillows that safely catch fast solar particles without shattering them!"
    )
    
    recommendation = (
        f"Mission Control Alert: Shelter Protocol {'MANDATORY (Hide now!)' if req.storm_class in ['S3', 'S4', 'S5'] else 'ADVISED (Stay inside)'}. "
        f"Astronauts should stay cozy inside the storm bunker for 36 to 48 hours until space satellites confirm the solar storm has passed."
    )
    
    # Dual timelines
    step = max(1, req.duration_days // 50)
    days = list(range(0, req.duration_days + 1, step))
    if req.storm_day not in days and req.storm_day <= req.duration_days:
        days.append(req.storm_day)
    days.sort()
    
    timeline_no_shelter: List[DailyDosePoint] = []
    timeline_with_shelter: List[DailyDosePoint] = []
    
    for d in days:
        gcr_cum_e = daily_e * d
        gcr_cum_h = daily_h * d
        spe_add_no_e = spe_no_shelter_e if d >= req.storm_day else 0.0
        spe_add_with_e = spe_with_shelter_e if d >= req.storm_day else 0.0
        spe_add_no_h = spe_no_shelter_h if d >= req.storm_day else 0.0
        spe_add_with_h = spe_with_shelter_h if d >= req.storm_day else 0.0
        
        tot_no_e = round(gcr_cum_e + spe_add_no_e, 2)
        tot_with_e = round(gcr_cum_e + spe_add_with_e, 2)
        tot_no_h = round(gcr_cum_h + spe_add_no_h, 2)
        tot_with_h = round(gcr_cum_h + spe_add_with_h, 2)
        
        timeline_no_shelter.append(DailyDosePoint(
            day=d,
            cumulative_dose_equivalent=tot_no_h,
            cumulative_effective_dose=tot_no_e,
            cumulative_expected=tot_no_e,
            cumulative_low=round(tot_no_e * 0.85, 2),
            cumulative_high=round(tot_no_e * 1.20, 2),
            daily_rate=daily_e
        ))
        
        timeline_with_shelter.append(DailyDosePoint(
            day=d,
            cumulative_dose_equivalent=tot_with_h,
            cumulative_effective_dose=tot_with_e,
            cumulative_expected=tot_with_e,
            cumulative_low=round(tot_with_e * 0.85, 2),
            cumulative_high=round(tot_with_e * 1.20, 2),
            daily_rate=daily_e
        ))
        
    return StormScenarioResponse(
        destination=req.destination,
        duration_days=req.duration_days,
        storm_day=req.storm_day,
        storm_class=req.storm_class,
        background_gcr_dose_equivalent_msv=total_gcr_h,
        background_gcr_effective_dose_msv=total_gcr_e,
        background_gcr_msv=total_gcr_e,
        spe_unshielded_dose_msv=unshielded_spe,
        spe_no_shelter_dose_equiv_msv=spe_no_shelter_h,
        spe_no_shelter_effective_msv=spe_no_shelter_e,
        spe_with_shelter_dose_equiv_msv=spe_with_shelter_h,
        spe_with_shelter_effective_msv=spe_with_shelter_e,
        spe_no_shelter_dose_msv=spe_no_shelter_e,
        spe_with_shelter_dose_msv=spe_with_shelter_e,
        total_without_shelter_msv=total_no_shelter_e,
        total_with_shelter_msv=total_with_shelter_e,
        total_no_shelter_effective_msv=total_no_shelter_e,
        total_with_shelter_effective_msv=total_with_shelter_e,
        dose_saved_effective_msv=dose_saved_e,
        dose_saved_msv=dose_saved_e,
        reduction_percentage=reduction_pct,
        risk_without_shelter=risk_no_shelter,
        risk_with_shelter=risk_with_shelter,
        why_explanation=why_explanation,
        recommendation=recommendation,
        timeline_no_shelter=timeline_no_shelter,
        timeline_with_shelter=timeline_with_shelter,
    )

def generate_shielding_comparison() -> ShieldingComparisonResponse:
    """
    Computes comparative GCR dose across Aluminium, Polyethylene, Water, and Regolith
    over areal densities from 0 to 100 g/cm² for a 180-day Mars transit.
    """
    datapoints: List[ShieldingMaterialComparisonPoint] = []
    duration = 180
    base_rate = BASELINE_GCR_RATES_MSV_DAY["mars_transit"]
    
    for density in [0.0, 5.0, 10.0, 15.0, 20.0, 25.0, 30.0, 40.0, 50.0, 60.0, 75.0, 100.0]:
        al_trans = calculate_gcr_attenuation_factor(density, "aluminium")
        pe_trans = calculate_gcr_attenuation_factor(density, "polyethylene")
        wt_trans = calculate_gcr_attenuation_factor(density, "water")
        rg_trans = calculate_gcr_attenuation_factor(density, "regolith")
        
        datapoints.append(ShieldingMaterialComparisonPoint(
            areal_density=density,
            aluminium_dose=round(base_rate * duration * al_trans * DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO, 1),
            polyethylene_dose=round(base_rate * duration * pe_trans * DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO, 1),
            water_dose=round(base_rate * duration * wt_trans * DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO, 1),
            regolith_dose=round(base_rate * duration * rg_trans * DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO, 1)
        ))
        
    insights = [
        "1. Plastic is King: Hydrogen-rich materials (like HDPE plastic and water) are the best shields in space! They catch fast particles smoothly like soft pillows.",
        "2. The Metal Trap: If you make metal aluminium walls too thick (over 25 g/cm²), cosmic rays smash the metal atoms like bowling balls into pins, creating dangerous secondary neutron dust!",
        "3. Free Dirt on the Moon & Mars: Piling up local soil (regolith) around a moonbase makes a thick, free radiation bunker without carrying heavy metal from Earth.",
        "4. Real Thickness Matters: Different materials block space rays in different ways, so NASA measures real wall thickness instead of guessing."
    ]
    
    return ShieldingComparisonResponse(
        description="Comparative GCR effective dose across 180-day Mars transit as a function of material areal density (g/cm²).",
        datapoints=datapoints,
        insights=insights
    )
