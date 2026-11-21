# StarForge: AstroShield Mission Radiation Console

**ASTRA 2026 Hackathon - Domain 5: Moon, Mars and Deep-Space Exploration**

AstroShield is an interactive space mission planning console designed to estimate radiation exposure for astronauts traveling to the Moon, Mars, and deep space. It connects live space weather satellite observations from NOAA and ISRO Aditya-L1 to calculate safe flight durations and spaceship shield requirements under official NASA safety standards.

---

## What This Project Does

When humans leave Earth, they leave behind our planet's atmosphere and magnetic field, which act as a natural shield against harmful deep-space radiation. 

In deep space, astronauts face two major radiation dangers:
1. **Galactic Cosmic Rays (GCR):** A continuous, slow cosmic rain of atomic particles originating from ancient exploded stars across the galaxy. These particles hit the spaceship every day of the journey.
2. **Solar Particle Events (SPE):** Unpredictable, explosive radiation storms ejected by the Sun. While infrequent, a single major solar storm can deliver a hazardous dose of radiation within 24 to 48 hours unless astronauts have a storm shelter.

AstroShield answers three critical questions for any mission:
- How much total radiation will the crew absorb during their mission?
- Does that dose stay safely below NASA's lifetime career safety limit of 600 millisieverts (mSv)?
- How much spaceship hull armor is needed to protect the crew during a solar storm?

---

## How The Code Works

StarForge is built as a complete client-server application. Here is how the project processes a mission calculation from start to finish:

### Step 1: Gathering Mission Parameters (Frontend)
The user configures their mission through the web console:
- **Destination:** Deep space transit to Mars, camping on Mars' surface, walking on the Moon, or high lunar orbit.
- **Duration:** How many days the crew will spend in space (for example, 180 days for a standard one-way Mars flight).
- **Crew Size:** Number of astronauts on board.
- **Spaceship Shielding:** The wall thickness (areal density in g/cm²) and shield material (Aluminium, Hydrogen Plastic / HDPE, Water, or Moon/Mars soil).
- **Sun Activity Cycle:** Whether the Sun is at minimum, moderate, or maximum activity in its 11-year cycle.

### Step 2: Live Space Weather Ingestion (Backend)
The backend service contacts space agencies to gather live telemetry:
- **NOAA GOES Satellites:** Measures real-time proton particles flying through space, planetary magnetic storm activity (Kp index), and solar X-ray flare brightness.
- **ISRO Aditya-L1 Observatory:** Gathers observations from India's solar probe positioned at Lagrange Point 1 (1.5 million kilometers towards the Sun) using its ASPEX particle spectrometer and SoLEXS X-ray payload.

### Step 3: Dose Calculation Engine (Backend Physics Model)
The server runs an explainable physics engine calibrated against real robotic space missions:
- **Baseline Rates:** Calibrated with data from NASA's Curiosity rover (MSL RAD) during its 253-day flight to Mars and surface stay, along with China's Chang'e-4 lunar lander.
- **Shield Attenuation:** Calculates how much radiation penetrates different materials. Hydrogen-rich materials like plastic (HDPE) and water absorb deep-space rays smoothly, while standard aluminium can produce secondary particle scatter if too thick.
- **Human Tissue Absorption:** Differentiates between raw instrument sensor clicks (Dose Equivalent, H) and what human organs actually absorb (Effective Dose, E) using NASA's 0.65 tissue-weighting conversion factor.

### Step 4: Safety Assessment & Visualization (Frontend)
The calculated dose is returned to the browser and visualized in real time:
- An interactive mission timeline plots cumulative radiation day-by-day.
- A risk gauge compares the mission dose against NASA's 600 mSv career limit and 250 mSv single-storm threshold.
- Instant warnings alert the user if shielding is too thin or if a simulated solar storm exceeds safe parameters.

---

## Codebase Organization

The repository is structured into two main parts:

```
StarForge/
├── backend/                  # Python calculation engine and satellite APIs
│   ├── app/
│   │   ├── main.py           # FastAPI web application entry point
│   │   ├── dose_engine.py    # Physics calculation logic and NASA limit checks
│   │   ├── weather_service.py # Live NOAA SWPC & NASA DONKI satellite fetching
│   │   ├── aditya_service.py # ISRO Aditya-L1 satellite data processing
│   │   ├── constants.py      # Calibration constants and material densities
│   │   └── schemas.py        # Data validation and request/response models
│   ├── data/                 # Sample satellite datasets and cached fallbacks
│   └── tests/                # Automated unit tests for calculation accuracy
│
├── frontend/                 # Interactive user interface
│   ├── src/
│   │   ├── App.tsx           # Main application dashboard and state coordinator
│   │   ├── components/
│   │   │   ├── MissionBuilder.tsx     # Mission configuration controls (Steps 1 & 2)
│   │   │   ├── DoseTimeline.tsx       # Interactive dose timeline graph
│   │   │   ├── RiskSummary.tsx        # NASA safety gauge and health impact cards
│   │   │   ├── ShieldingComparison.tsx # Material performance comparison table
│   │   │   ├── SpaceWeatherPanel.tsx  # Live satellite telemetry ticker
│   │   │   ├── AdityaL1Panel.tsx      # ISRO Aditya-L1 vs NOAA GOES comparisons
│   │   │   ├── StormScenarioModal.tsx # Solar Particle Event (SPE) simulator
│   │   │   ├── SpaceIntroAnimation.tsx # 3D starfield intro sequence
│   │   │   └── Navbar.tsx & Footer.tsx # Navigation and project metadata
│   │   └── index.css         # Styling system and space telemetry design
│   └── index.html            # Webpage entry point
│
├── README.md                 # Project documentation
├── vercel.json               # Frontend deployment configuration
└── render.yaml               # Backend cloud deployment configuration
```

---

## Key Features

- **Interactive Mission Planner:** Adjust destination, flight days, crew count, and spaceship armor to immediately see how radiation levels change.
- **Solar Storm Attack Simulator:** Test how an unexpected solar flare (such as the historic Halloween 2003 storm) impacts the crew, and verify if an onboard bunker blocks the blast.
- **Live Space Weather Telemetry:** Real-time stream of proton counts, magnetic storm indices, and solar flare ratings from NOAA satellites.
- **ISRO Aditya-L1 Integration:** Upstream solar observations from India's halo-orbit observatory cross-referenced with Earth-orbit satellites.
- **Explainable Space Science:** Clear, jargon-free explanations explaining why certain materials work better and how space radiation behaves.

---

## Running The Project Locally

If you would like to run this project on your computer, follow these simple steps:

### 1. Start the Backend
Open a terminal in the project folder:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
The backend API is now running at `http://127.0.0.1:8000`. You can test the endpoints at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://127.0.0.1:5173` in your browser to view and interact with the AstroShield Mission Console.

---

## Real-World Science Calibration

AstroShield uses empirical radiation measurements gathered by real robotic missions:
- **Mars Science Laboratory (MSL RAD):** Measured 1.84 mSv/day during the 2012 Mars transit cruise (Zeitlin et al. 2013) and 0.64 mSv/day on the surface inside Curiosity (Hassler et al. 2014).
- **Lunar Chang'e-4 Lander (LND):** Measured ~1.44 mSv/day on the lunar surface (Zhang et al. 2020).
- **NASA Standard NASA-STD-3001:** Enforces a universal career limit of 600 mSv effective dose for all astronauts.

---

## Disclaimer

AstroShield is an educational mission-planning tool and exploratory simulator. It uses first-order transport physics calibrated against published space agency datasets to demonstrate shielding concepts and mission trade-offs, and is not intended for flight-certified operational navigation.
