"""
AstroShield Constants & Physics Calibration Data
================================================
References and calibration citations:
1. MSL RAD:
   - Zeitlin et al. (2013) Science 340, 1080-1084 (Mars 253-day cruise phase dose equivalent 1.84 ± 0.3 mSv/day, measured near Solar Max).
   - Hassler et al. (2014) Science 343, 1244797 (Mars surface dose equivalent 0.64 ± 0.12 mSv/day, Aug 2012–Jun 2013).
   - SPE events during 2012 cruise: 3 events totaled 24.7 mSv (~5% of cruise dose); largest single event was 19.5 mSv (Zeitlin et al. 2013).
2. Chang'e-4 LND:
   - Zhang et al. (2020) Science Advances 6, eaaz1334 (doi:10.1126/sciadv.aaz1334): ~60 uSv/h ≈ 1.44 mSv/day dose equivalent inside lander structure.
3. Dose Equivalent (H) vs Effective Dose (E) Conversion:
   - SFRP / MSL RAD Mission Synthesis Slide:
     * 180-day cruise: ~0.33 Sv dose equivalent vs ~0.22 Sv effective dose (ratio ~0.667).
     * 600-day surface stay: ~0.38 Sv dose equivalent vs ~0.24 Sv effective dose (ratio ~0.632).
     * Full mission (300d surface): ~0.85 Sv dose equivalent vs ~0.56 Sv effective dose (ratio ~0.659).
     * Mean ratio E / H ≈ 0.65 (range 0.63–0.67).
4. NASA-STD-3001 Vol 1 Rev C (Approved 15 Sept 2023):
   - Universal career effective dose limit: 600 mSv (all ages and sexes, 3% REID mean for 35yo female).
   - Short-term SPE limit: 250 mSv per event (effective dose).
   - 1-Year mission limit: 500 mSv.
5. Shielding Physics & Material Non-linearities:
   - NASA studies demonstrate that "Aluminium-equivalent" approximations cause substantial interior particle environment errors.
   - For GCR, Aluminium dose equivalent bottoms out around 20–30 g/cm² and subsequently rises due to secondary neutron fragmentation,
     while Polyethylene flattens.
6. Durante (2014) Life Sciences in Space Research: Mission totals cross-validation.
7. Aditya-L1 Data:
   - ISRO ISSDC / PRADAN.
   - Zenodo open dataset: ASPEX-STEPS Level-1a data (7 Jan to 10 May 2024, AR3664 solar storm period).
"""

from typing import Dict, Any

APP_TITLE = "AstroShield: Mission Radiation Console"
DISCLAIMER = (
    "AstroShield is a mission-planning estimator and educational physics console, "
    "not a medical-grade radiation dosimetry instrument. Values represent expected "
    "equivalent and effective doses calibrated against empirical robotic rover and lander measurements."
)

# TODO: Conversion ratio from Dose Equivalent (H, measured by MSL RAD) to Effective Dose (E, used for NASA-STD-3001 limits).
# Derived from MSL RAD cruise/surface comparisons (Hassler et al. / SFRP), where whole-body tissue weighting (w_T)
# yields an effective/dose-equivalent ratio of ~0.63 to 0.67. Default: 0.65.
DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO = 0.65

# Baseline GCR Dose Equivalent Rates (mSv / day) under solar maximum conditions (when MSL was measured)
BASELINE_GCR_RATES_MSV_DAY: Dict[str, float] = {
    "lunar_orbit": 1.65,      # Deep space cislunar, 4pi exposure (Reitz et al. 2012)
    "lunar_surface": 1.44,    # Chang'e-4 LND (Zhang et al. 2020: ~60 uSv/h * 24h = ~1.44 mSv/day inside lander)
    "mars_transit": 1.84,     # MSL RAD cruise phase (Zeitlin et al. 2013: 1.84 ± 0.3 mSv/day, Solar Max)
    "mars_surface": 0.64,     # MSL RAD surface (Hassler et al. 2014: 0.64 ± 0.12 mSv/day behind ~20 g/cm² CO2 + 2pi planet)
}

# Solar Cycle Modulation Factors
# MSL RAD measured 1.84 mSv/day near Solar Maximum (Cycle 24).
# During Solar Minimum, heliospheric magnetic field scatters fewer GCR ions -> flux increases by ~25%.
SOLAR_MODULATION_FACTORS: Dict[str, float] = {
    "solar_min": 1.25,      # Peak GCR flux (+25% above MSL solar max benchmark)
    "solar_moderate": 1.10, # Moderate solar activity (+10% above solar max)
    "solar_max": 1.00,      # Baseline solar maximum (MSL RAD calibration point)
}

# Shielding Material Attenuation & Non-linear Saturation Properties
# Form: factor = floor + (1 - floor) * exp(-x / lambda) + buildup(x)
# Areal density x is given in g/cm² of the ACTUAL CHOSEN MATERIAL (not Al-equivalent).
# NASA transport modeling shows Aluminium bottoms out around 20-30 g/cm² and then experiences
# secondary neutron buildup, while Polyethylene and Water flatten without rising.
MATERIAL_PROPERTIES: Dict[str, Dict[str, Any]] = {
    "polyethylene": {
        "name": "High-Density Polyethylene (HDPE)",
        "density_g_cm3": 0.95,
        "floor": 0.42,                  # Flattens cleanly; excellent hydrogen stopping power
        "lambda_g_cm2": 26.0,           # Characteristic absorption areal density
        "has_secondary_upturn": False,
        "spe_attenuation_coeff": 0.078, # Steep proton stopping
        "description": "Hydrogen-rich ((C2H4)n). Superior electron-to-nucleon ratio stops charged particles with virtually zero secondary neutron fragmentation.",
        "is_hydrogen_rich": True,
    },
    "water": {
        "name": "Water / Consumables (H2O)",
        "density_g_cm3": 1.00,
        "floor": 0.45,
        "lambda_g_cm2": 28.0,
        "has_secondary_upturn": False,
        "spe_attenuation_coeff": 0.072,
        "description": "Dual-use life support and storm shelter jacket. Exceptional hydrogen stopping power with minimal secondary cascades.",
        "is_hydrogen_rich": True,
    },
    "regolith": {
        "name": "Planetary Regolith (In-situ simulant)",
        "density_g_cm3": 1.55,
        "floor": 0.52,
        "lambda_g_cm2": 38.0,
        "has_secondary_upturn": False,
        "spe_attenuation_coeff": 0.048,
        "description": "In-situ resource utilization (ISRU) material. Sits between aluminium and hydrogen shields; low launch cost enables thick surface berms.",
        "is_hydrogen_rich": False,
    },
    "aluminium": {
        "name": "Aluminium (Al-6061)",
        "density_g_cm3": 2.70,
        "floor": 0.58,                  # Higher saturation floor
        "lambda_g_cm2": 32.0,
        "has_secondary_upturn": True,   # Secondary neutron/bremsstrahlung buildup past 25 g/cm²
        "upturn_threshold_g_cm2": 25.0,
        "upturn_slope": 0.0068,         # Produces upturn in dose equivalent past 25 g/cm² due to secondary neutrons
        "spe_attenuation_coeff": 0.052,
        "description": "Standard aerospace alloy. Weakest GCR shield per unit mass; bottoms out near 20-30 g/cm² then rises due to secondary neutron cascades.",
        "is_hydrogen_rich": False,
    },
}

# NASA-STD-3001 Vol 1 Rev C (Approved 15 Sept 2023) Limits
NASA_LIMITS: Dict[str, float] = {
    "career_effective": 600.0,   # Universal career effective dose limit (all ages & sexes, 3% REID mean for 35yo female)
    "spe_event_effective": 250.0,# Short-term SPE effective dose limit per event
    "one_year_effective": 500.0, # 1-year career step limit
    "thirty_day_effective": 250.0# 30-day deterministic organ protection limit
}

# Calibrated SPE Benchmark: MSL RAD 2012 Cruise Event
# MSL RAD observed 3 SPEs totaling 24.7 mSv; the largest single event delivered 19.5 mSv behind the cruise stage (Zeitlin et al. 2013).
MSL_LARGEST_SPE_MSV = 19.5

# NOAA Solar Radiation Storm (S-Scale) Reference Table
# Exact SWPC thresholds: >=10 MeV proton flux of 10, 100, 1000, 10000, 100000 pfu
NOAA_S_SCALE_TABLE: Dict[str, Dict[str, Any]] = {
    "S0": {
        "name": "Quiet & Calm",
        "flux_threshold_pfu": "< 10",
        "biological_impact": "All peaceful. Only gentle everyday background space rays.",
        "typical_spe_unshielded_dose_msv": 0.0,
        "color": "#10B981"
    },
    "S1": {
        "name": "S1 Minor Rumble",
        "flux_threshold_pfu": ">= 10",
        "biological_impact": "Small solar burp. Very safe inside standard spacecraft.",
        "typical_spe_unshielded_dose_msv": 3.5,
        "color": "#38BDF8"
    },
    "S2": {
        "name": "S2 Moderate Storm",
        "flux_threshold_pfu": ">= 100",
        "biological_impact": "Noticeable storm. Astronauts should cancel spacewalks and stay inside.",
        "typical_spe_unshielded_dose_msv": 25.0,
        "color": "#FACC15"
    },
    "S3": {
        "name": "S3 Big Solar Tempest",
        "flux_threshold_pfu": ">= 1,000",
        "biological_impact": "Serious radiation storm! Astronauts must run into the emergency bunker.",
        "typical_spe_unshielded_dose_msv": 120.0,
        "color": "#F97316"
    },
    "S4": {
        "name": "S4 Severe Monster Storm",
        "flux_threshold_pfu": ">= 10,000",
        "biological_impact": "Dangerous storm! High radiation risk without a thick hydrogen or water bunker.",
        "typical_spe_unshielded_dose_msv": 450.0,
        "color": "#EF4444"
    },
    "S5": {
        "name": "S5 Mega Extreme Storm",
        "flux_threshold_pfu": ">= 100,000",
        "biological_impact": "Historic super-storm! Lethal radiation without heavy storm shelter protection.",
        "typical_spe_unshielded_dose_msv": 1500.0,
        "color": "#DC2626"
    },
}

# Risk classifications based on NASA Effective Dose
RISK_LEVEL_DEFINITIONS: Dict[str, Dict[str, str]] = {
    "Low": {
        "badge_color": "emerald",
        "threshold": "Effective Dose < 50 mSv",
        "summary": "Safe & Sound! Astronaut dose is well below NASA 30-day (250 mSv) and lifetime (600 mSv) limits.",
        "clinical_note": "No illness expected; your astronauts are super healthy and ready to explore!"
    },
    "Moderate": {
        "badge_color": "yellow",
        "threshold": "Effective Dose 50 - 250 mSv",
        "summary": "Caution Needed. Radiation is building up and approaching NASA's 30-day limit (250 mSv).",
        "clinical_note": "Crew feels fine, but doctors will keep careful score of their space radiation allowance."
    },
    "High": {
        "badge_color": "orange",
        "threshold": "Effective Dose 250 - 500 mSv",
        "summary": "Danger Zone! Passed NASA's 30-day safety limit (250 mSv) or used more than half of lifetime budget.",
        "clinical_note": "Crew needs extra shielding and medical checks to prevent radiation fatigue."
    },
    "Critical": {
        "badge_color": "red",
        "threshold": "Effective Dose > 500 mSv",
        "summary": "Emergency! Exceeds NASA 1-year safety ceiling (500 mSv) and threatens the 600 mSv lifetime limit.",
        "clinical_note": "Dangerous radiation sickness risk! Astronauts must take shelter in a thick bunker right away."
    }
}
