"""
AstroShield FastAPI Main Application
====================================
Mission Radiation Console for Moon, Mars & Deep-Space Exploration.
ASTRA 2026 - Domain 5.
"""

from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.app.schemas import (
    MissionEstimateRequest,
    MissionEstimateResponse,
    StormScenarioRequest,
    StormScenarioResponse,
    ShieldingComparisonResponse,
    SpaceWeatherTelemetry,
    AdityaL1Telemetry,
)
from backend.app.dose_engine import (
    generate_mission_estimate,
    generate_storm_scenario,
    generate_shielding_comparison,
)
from backend.app.weather_service import get_live_space_weather, get_historical_donki_events
from backend.app.aditya_service import get_aditya_l1_data
from backend.app.constants import (
    APP_TITLE,
    DISCLAIMER,
    DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO,
    BASELINE_GCR_RATES_MSV_DAY,
    SOLAR_MODULATION_FACTORS,
    MATERIAL_PROPERTIES,
    NASA_LIMITS,
    NOAA_S_SCALE_TABLE,
    RISK_LEVEL_DEFINITIONS,
)

app = FastAPI(
    title=APP_TITLE,
    version="1.1.0",
    description="Deep-space astronaut radiation estimation, live space weather, and solar storm shelter modeling.",
)

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
async def health_check():
    """Health status endpoint for uptime monitoring and deploy orchestrators."""
    return {
        "status": "healthy",
        "service": "AstroShield Backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.1.0",
        "domain": "ASTRA 2026 - Domain 5 (Moon, Mars & Deep-Space Exploration)",
    }

@app.get("/api/weather/live", response_model=SpaceWeatherTelemetry, tags=["Telemetry"])
async def get_space_weather():
    """
    Returns live space-weather telemetry (Proton flux, Kp, NOAA S-Scale, Flare class).
    Falls back gracefully to bundled cached data if external feeds fail.
    """
    return await get_live_space_weather()

@app.get("/api/events", tags=["Telemetry"])
async def get_solar_events():
    """Returns recent Solar Energetic Particle (SEP) events from NASA DONKI cached catalog."""
    return await get_historical_donki_events()

@app.post("/api/mission/estimate", response_model=MissionEstimateResponse, tags=["Dose Engine"])
async def estimate_mission_dose(request: MissionEstimateRequest):
    """
    Calculates cumulative GCR dose equivalent (H) and effective dose (E = H * 0.65),
    low/high confidence bands, and NASA-STD-3001 Rev C compliance limits.
    """
    try:
        return generate_mission_estimate(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Dose estimation failed: {str(e)}")

@app.post("/api/mission/scenario", response_model=StormScenarioResponse, tags=["Dose Engine"])
async def simulate_storm_scenario(request: StormScenarioRequest):
    """
    Simulates a Solar Particle Event (SPE) during mission and compares dose
    with and without dedicated storm shelter refuge.
    """
    try:
        return generate_storm_scenario(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Storm simulation failed: {str(e)}")

@app.get("/api/shelter/compare", response_model=ShieldingComparisonResponse, tags=["Shielding"])
async def compare_shielding_materials():
    """
    Returns comparative dose attenuation curves for Aluminium, Polyethylene,
    Water, and Lunar/Martian Regolith across areal densities from 0 to 100 g/cm².
    """
    return generate_shielding_comparison()

@app.get("/api/aditya-l1", response_model=AdityaL1Telemetry, tags=["Aditya-L1"])
async def get_aditya_l1_telemetry():
    """
    Returns preloaded sample data from ISRO Aditya-L1 (ASPEX STEPS vs GOES protons;
    SoLEXS soft X-rays vs GOES solar X-rays).
    """
    return get_aditya_l1_data()

@app.get("/api/assumptions", tags=["Physics"])
async def get_model_assumptions():
    """
    Exposes all underlying empirical reference citations, constants,
    and physical assumptions used by the dose calculation engine.
    """
    return {
        "disclaimer": DISCLAIMER,
        "dose_equivalent_to_effective_ratio": DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO,
        "baseline_gcr_rates_msv_day": BASELINE_GCR_RATES_MSV_DAY,
        "solar_modulation_factors": SOLAR_MODULATION_FACTORS,
        "material_properties": MATERIAL_PROPERTIES,
        "nasa_limits": NASA_LIMITS,
        "noaa_s_scale_table": NOAA_S_SCALE_TABLE,
        "risk_level_definitions": RISK_LEVEL_DEFINITIONS,
        "citations": [
            "MSL RAD 253-day Cruise: Zeitlin et al. (2013) Science 340, 1080-1084 (1.84 ± 0.3 mSv/day dose equiv, Solar Max)",
            "MSL RAD Surface: Hassler et al. (2014) Science 343, 1244797 (0.64 ± 0.12 mSv/day)",
            "Chang'e-4 LND Moon: Zhang et al. (2020) Science Advances 6, eaaz1334 (~60 uSv/h ≈ 1.44 mSv/day inside lander)",
            "NASA-STD-3001 Vol 1 Rev C (Approved 15 Sept 2023): Universal 600 mSv career effective dose limit & 250 mSv short-term SPE limit",
            "Durante (2014) Life Sciences in Space Research: Space radiation hazard review",
            "ISRO Aditya-L1 ASPEX & SoLEXS: ISSDC / PRADAN & Zenodo open access dataset (Jan-May 2024, AR3664)",
            "NOAA Space Weather Prediction Center (SWPC) Real-Time JSON Services"
        ]
    }
