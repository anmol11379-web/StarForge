"""
Integration API Tests for AstroShield FastAPI App
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_live_weather_endpoint():
    response = client.get("/api/weather/live")
    assert response.status_code == 200
    data = response.json()
    assert "proton_flux_gt_10mev" in data
    assert "kp_index" in data
    assert "noaa_s_scale" in data
    assert "is_cached" in data

def test_mission_estimate_endpoint():
    payload = {
        "destination": "mars_transit",
        "duration_days": 180,
        "crew_size": 4,
        "shielding_areal_density": 20.0,
        "shielding_material": "aluminium",
        "solar_cycle_phase": "solar_moderate"
    }
    response = client.post("/api/mission/estimate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_dose_equivalent_msv"] > 0
    assert data["total_effective_dose_msv"] > 0
    assert data["dose_equivalent_to_effective_ratio"] == 0.65
    assert len(data["timeline"]) > 5
    assert "career_limit_pct" in data

def test_storm_scenario_endpoint():
    payload = {
        "destination": "mars_transit",
        "duration_days": 180,
        "baseline_shielding": 10.0,
        "storm_day": 45,
        "storm_class": "S3",
        "shelter_shielding": 35.0,
        "shelter_material": "polyethylene"
    }
    response = client.post("/api/mission/scenario", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_with_shelter_effective_msv"] < data["total_no_shelter_effective_msv"]
    assert data["dose_saved_effective_msv"] > 0
    assert "why_explanation" in data

def test_shelter_compare_endpoint():
    response = client.get("/api/shelter/compare")
    assert response.status_code == 200
    data = response.json()
    assert len(data["datapoints"]) > 0

def test_aditya_l1_endpoint():
    response = client.get("/api/aditya-l1")
    assert response.status_code == 200
    data = response.json()
    assert data["is_preloaded"] is True
    assert len(data["aspex_proton_datapoints"]) > 0
    assert len(data["solexs_xray_datapoints"]) > 0

def test_assumptions_endpoint():
    response = client.get("/api/assumptions")
    assert response.status_code == 200
    data = response.json()
    assert data["dose_equivalent_to_effective_ratio"] == 0.65
    assert "citations" in data
