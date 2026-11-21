# AstroShield: Mission Radiation Console 🛡️🚀

**ASTRA 2026 Hackathon • Domain 5: Moon, Mars & Deep-Space Exploration**

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TS-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Theme-astroshield--eta-fc9f30.svg)](https://astroshield-eta.vercel.app)
[![NASA-STD-3001](https://img.shields.io/badge/Standard-NASA--STD--3001%20Rev%20C-red.svg)](https://www.nasa.gov/)

AstroShield is an explainable, physics-grounded mission planning console that estimates astronaut radiation dose across Lunar and Martian trajectories, ingests real-time space weather telemetry from NOAA SWPC and NASA DONKI, models emergency storm shelter dynamics during Solar Particle Events (SPE), and cross-compares upstream telemetry from ISRO's Aditya-L1 observatory at Lagrange Point 1.

---

## 🌌 What AstroShield Does · The Mission

> **Our Mission in One Simple Sentence:**  
> *"We help keep astronauts safe from space radiation by showing how much they'll receive, when it's safest to fly, and how to shield their spaceship."*

When astronauts travel to the Moon or Mars, they get hit by harmful radiation from deep space. Out in space, Earth's magnetic field no longer protects them. This radiation comes from two sources:
1. **Cosmic rays (GCR):** Always there, non-stop throughout the entire trip. Deep-space particles arriving from ancient exploded stars that slowly build up inside astronauts day by day.
2. **Solar storms (SPE):** The Sun suddenly throws out giant explosive radiation bursts. They are unpredictable, and without a safe bunker to hide in, can make astronauts sick in hours.

### ❓ Three Questions Every Space Mission Must Answer
Anyone planning a crewed space mission needs simple, trustworthy answers to three big questions:
1. **How much radiation will the astronauts get?**  
   *AstroShield's answer:* Enter your destination and days. We calculate total crew dose and check whether it stays safely below NASA's 600 mSv lifetime limit.
2. **When is the safest time to fly?**  
   *AstroShield's answer:* The Sun follows an 11-year cycle of quiet and stormy periods. We ingest live NOAA satellite feeds and Aditya-L1 observations to identify safe flight windows.
3. **How thick should the storm shelter be?**  
   *AstroShield's answer:* An interactive simulator tests plastic, water, Moon soil, and metal to show exactly how much armor is needed to block 90%+ of solar storm rays.

---

## 🔬 Core Physics & Radiological Modeling

### 1. Dose Equivalent ($H$) vs Effective Dose ($E$)
A crucial distinction in space radiobiology:
- **Dose Equivalent ($H$, Sv / mSv):** The physical quantity measured by detectors like MSL RAD (integrating absorbed dose $D$ weighted by radiation quality factor $Q(L)$).
- **Effective Dose ($E$, Sv / mSv):** The tissue-weighted quantity ($E = \sum w_T H_T$) defined by the ICRP to quantify stochastic health risk (cancer mortality).
- **NASA's 600 mSv Career Limit is Effective Dose ($E$).** Dose equivalent cannot be directly compared to this limit without organ weighting.
- **Conversion Ratio ($E/H \approx 0.65$):** MSL RAD mission synthesis (SFRP / Hassler et al.) reports:
  - 180-day cruise: $\sim 0.33\text{ Sv}$ dose equivalent vs $\sim 0.22\text{ Sv}$ effective dose ($E/H \approx 0.667$).
  - 600-day Mars surface stay: $\sim 0.38\text{ Sv}$ dose equivalent vs $\sim 0.24\text{ Sv}$ effective dose ($E/H \approx 0.632$).
  - Full mission (300d surface): $\sim 0.85\text{ Sv}$ dose equivalent vs $\sim 0.56\text{ Sv}$ effective dose ($E/H \approx 0.659$).
- AstroShield documents this conversion constant (`DOSE_EQUIVALENT_TO_EFFECTIVE_RATIO = 0.65`) and displays **both** numbers in the interface.

### 2. Saturated GCR Shielding & Aluminium Buildup
Pure exponential attenuation is inadequate for GCR. NASA radiation transport studies demonstrate:
$$\text{factor} = \text{floor} + (1 - \text{floor}) \cdot \exp(-x / \lambda) + \text{buildup}(x)$$

- **Polyethylene (HDPE) & Water ($\text{H}_2\text{O}$):** Hydrogen-rich shields flatten cleanly towards a low floor ($\sim 0.42$) without secondary upturn because light nuclei stop protons via dense atomic electrons with minimal neutron fragmentation.
- **Planetary Regolith:** Sits in between ($\text{floor} \approx 0.52$), making in-situ resource utilization (ISRU) surface berms effective without launch mass penalties.
- **Aluminium (Al-6061):** Weakest shield per unit mass; bottoms out around $20\text{--}30\text{ g/cm}^2$ and subsequently exhibits a **secondary particle upturn** from neutron spallation and fragment buildup past $25\text{ g/cm}^2$.

### 3. Areal Density Input (Dropping "Al-Equivalent")
A NASA study concluded that the common "aluminium-equivalent" approximation introduces large errors into the interior secondary particle spectra. AstroShield accepts the **physical areal density ($x$ in $\text{g/cm}^2$)** of the chosen material directly.

### 4. Empirical Calibration Baselines
- **Mars Transit:** $1.84 \pm 0.3\text{ mSv/day}$ dose equivalent ($1.20\text{ mSv/day}$ effective dose) measured by MSL RAD during its 253-day cruise near solar maximum (Zeitlin et al. 2013).
- **Mars Surface:** $0.64 \pm 0.12\text{ mSv/day}$ dose equivalent ($0.42\text{ mSv/day}$ effective dose) measured by MSL RAD on Curiosity Rover (Hassler et al. 2014) behind $\sim 20\text{ g/cm}^2$ $\text{CO}_2$ atmosphere and $2\pi$ planetary body.
- **Lunar Surface:** $\sim 60\ \mu\text{Sv/h} \approx 1.44\text{ mSv/day}$ dose equivalent measured inside the lander by Chang'e-4 LND (Zhang et al. 2020).
- **SPE Calibration:** MSL RAD observed 3 SPE events during the 2012 cruise totaling $24.7\text{ mSv}$ (~5% of cruise dose); the largest single event delivered $19.5\text{ mSv}$ behind the spacecraft hull (Zeitlin et al. 2013).

### 5. NASA Occupational Radiation Limits
- **NASA-STD-3001 Vol 1 Rev C (Approved 15 Sept 2023):**
  - **Universal Career Effective Limit:** $600\text{ mSv}$ effective dose (universal for all ages and sexes, corresponding to a 3% mean risk of cancer mortality for a 35-year-old female).
  - **Short-term SPE Limit:** $250\text{ mSv}$ effective dose per event.
  - **1-Year Ceiling:** $500\text{ mSv}$ effective dose.
  - **30-Day Deterministic Limit:** $250\text{ mSv}$ (protects hematopoietic and central nervous systems).

---

## 🛰️ Live & Preloaded Space Weather Feeds

1. **NOAA SWPC:**
   - Real-time GOES integral proton flux ($\ge 1, 5, 10, 30, 50, 60, 100, 500\text{ MeV}$).
   - Exact NOAA S-Scale thresholds ($\ge 10\text{ MeV}$ proton flux): $S_1 \ge 10$, $S_2 \ge 100$, $S_3 \ge 1,000$, $S_4 \ge 10,000$, $S_5 \ge 100,000\text{ pfu}$.
   - Planetary $K_p$ index and GOES $0.1\text{--}0.8\text{ nm}$ solar X-ray flux.
2. **NASA DONKI:**
   - Handled as **cached-first** to respect the 30 requests/hour limit on `DEMO_KEY`.
3. **ISRO Aditya-L1 vs NOAA GOES:**
   - Matched instrument-to-instrument:
     - **ASPEX (STEPS):** Particle spectrometer compared with **GOES Proton Flux** (>10 MeV).
     - **SoLEXS (2–22 keV):** Soft X-ray spectrometer compared with **GOES Solar X-Ray Flux** (0.1–0.8 nm) and flare class.
   - Orbits: Lagrange Point 1 ($1.5 \times 10^6\text{ km}$ sunward) vs Geostationary ($35,786\text{ km}$).
   - Source: Open access Zenodo dataset for ASPEX-STEPS Level-1a data (Jan–May 2024, AR3664 solar storm period) & ISSDC / PRADAN.

---

## 🚀 Quickstart & Local Execution

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
pytest tests/
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Console UI: `http://localhost:5173`

---

## 📚 Peer-Reviewed Citations & References

1. **Zeitlin, C. et al. (2013).** *Measurements of Energetic Particle Radiation in Transit to Mars on the Mars Science Laboratory.* **Science**, 340(6136), 1080–1084.
2. **Hassler, D. M. et al. (2014).** *Mars' Surface Radiation Environment Measured with the Mars Science Laboratory's Curiosity Rover.* **Science**, 343(6169), 1244797.
3. **Zhang, S. et al. (2020).** *First measurements of the radiation dose on the lunar surface.* **Science Advances**, 6(39), eaaz1334 (doi:10.1126/sciadv.aaz1334).
4. **NASA (2023).** *NASA Space Flight Human-System Standard, Volume 1, Revision C: Crew Health.* NASA-STD-3001 (Approved Sept 15, 2023).
5. **Durante, M. (2014).** *Space radiation hazards and mitigation.* **Life Sciences in Space Research**, 1, 2–17.
6. **Zenodo / ISSDC:** Aditya-L1 ASPEX-STEPS Level-1a open dataset (May 2024 active region AR3664 storm sequence) & ISRO PRADAN.

---

## ⚠️ Limitations & Disclaimer
*AstroShield is a transparent mission-planning estimator and educational console, not medical-grade or flight-certified dosimetry. It employs first-order transport approximations calibrated against robotic landers and rovers. The "aluminium-equivalent" approximation has been discarded in favor of physical material areal densities per NASA transport recommendations.*
