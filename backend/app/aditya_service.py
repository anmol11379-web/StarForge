"""
Aditya-L1 Data Service
======================
Serves preloaded data from ISRO's Aditya-L1 observatory at Lagrange Point 1 (L1).
Properly matches instruments to their physical counterparts:
1. ASPEX (STEPS) particle spectrometer -> compared with NOAA GOES proton flux.
2. SoLEXS (2-22 keV) soft X-ray spectrometer -> compared with NOAA GOES X-ray flux & flare class.
Source: Open access Zenodo dataset (Jan-May 2024) & ISRO ISSDC / PRADAN.
"""

import json
from pathlib import Path
from backend.app.schemas import AdityaL1Telemetry

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def get_aditya_l1_data() -> AdityaL1Telemetry:
    """Loads bundled Aditya-L1 dataset with separate ASPEX and SoLEXS channels."""
    path = DATA_DIR / "aditya_l1_sample.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            aspex_pts = data.get("aspex_proton_datapoints", [])
            solexs_pts = data.get("solexs_xray_datapoints", [])
            
            # Map legacy unified datapoints for backward compatibility
            legacy_pts = []
            for i, p in enumerate(aspex_pts):
                sx = solexs_pts[i] if i < len(solexs_pts) else {}
                legacy_pts.append({
                    "timestamp": p.get("timestamp", ""),
                    "steps_proton_flux": p.get("aspex_steps_flux", 0.0),
                    "noaa_goes_flux": p.get("noaa_goes_proton_flux", 0.0),
                    "solexs_xray_flux": sx.get("noaa_goes_xray_flux", 0.0),
                    "solar_wind_speed_kms": p.get("solar_wind_speed_kms", 400),
                })
                
            return AdityaL1Telemetry(
                source=data.get("source", "ISRO ISSDC & Zenodo Open Access"),
                satellite=data.get("satellite", "Aditya-L1"),
                orbit=data.get("orbit", "Sun-Earth Halo Orbit at Lagrange Point 1 (~1.5M km)"),
                is_preloaded=True,
                label=data.get("label", "PRELOADED ZENODO / ISSDC SAMPLE"),
                reference_event=data.get("reference_event", "Solar Active Region AR3664 Severe Storm (May 2024)"),
                description=data.get("description", "ASPEX particles vs GOES protons; SoLEXS X-rays vs GOES solar X-rays."),
                timestamp_range=data.get("timestamp_range", "2024-05-10 to 2024-05-12"),
                aspex_proton_datapoints=aspex_pts,
                solexs_xray_datapoints=solexs_pts,
                datapoints=legacy_pts,
            )
            
    return AdityaL1Telemetry(
        source="ISRO ISSDC",
        satellite="Aditya-L1",
        orbit="Lagrange Point 1",
        is_preloaded=True,
        label="SAMPLE",
        reference_event="May 2024 Benchmark",
        description="Fallback sample data",
        timestamp_range="2024-05",
        aspex_proton_datapoints=[],
        solexs_xray_datapoints=[],
        datapoints=[],
    )
