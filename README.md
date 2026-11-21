# StarForge: AstroShield

A space radiation calculator that shows if astronauts are safe when traveling to the Moon and Mars.

Built for the ASTRA 2026 Hackathon (Domain 5: Moon, Mars and Deep-Space Exploration).

### Live Links
- Live Website: https://starforge-astro-shield.netlify.app/
- Live Backend API: https://starforge-us48.onrender.com/
- Interactive API Docs: https://starforge-us48.onrender.com/docs

---

## What is this project?

AstroShield is a website that helps space travelers stay safe. 

On Earth, we have air and a natural magnetic shield that protects us from space danger. But once astronauts leave Earth and fly to the Moon or Mars, that protection is gone. 

Deep space is full of invisible radiation. If astronauts absorb too much of it, it can make them very sick. 

AstroShield lets anyone plan a space mission and see:
- How much radiation the astronauts will receive.
- Whether the mission is safe under NASA's official health rules.
- What spaceship shields (like plastic, water, or Moon dirt) work best to protect the crew.

---

## Why space radiation is dangerous

Space radiation comes from two main things:

1. **Everyday Deep Space Rays:** 
   Tiny, super-fast particles coming from exploded stars far across the galaxy. They fly non-stop like invisible rain. Over a long trip to Mars, they slowly build up in the body.
2. **Surprise Solar Storms:** 
   Sudden, violent blasts thrown out by the Sun. They do not happen every day, but when they hit, they spray millions of dangerous particles in just a few hours. Astronauts need a storm bunker to survive them.

NASA has a strict safety rule: an astronaut should never absorb more than 600 millisieverts (mSv) of radiation across their entire career. AstroShield checks this rule automatically.

---

## How the website works (in 3 simple steps)

### 1. You choose your mission
On the website, you pick:
- **Where you are going:** Flying to Mars, landing on Mars, walking on the Moon, or orbiting in space.
- **How long you will stay:** For example, 180 days in space.
- **Spaceship wall armor:** How thick the spaceship walls are, and what material they are made of (metal, special hydrogen plastic, water tanks, or local dirt).

### 2. The code checks live satellite data
While you pick your settings, the backend code connects to real space satellites:
- **NOAA Weather Satellites:** Checks live space weather right now, including how many flying protons are in space and whether solar flares are active.
- **ISRO Aditya-L1:** Checks solar observations sent from India's space probe orbiting 1.5 million kilometers out in deep space.

### 3. The code calculates your crew's safety
The code takes your trip days, wall thickness, and satellite data, and runs the math:
- It shows your total radiation dose on a clear graph.
- It displays a simple safety status: Safe, Warning, or Dangerous.
- It lets you press a button to simulate a giant solar storm to see if your spaceship bunker holds up.

---

## What is inside this repository?

The project is split into two simple folders:

### 1. frontend (The website you see and click on)
This is built with React, TypeScript, and Tailwind CSS.
- `src/App.tsx`: The main dashboard page that ties everything together.
- `src/components/MissionBuilder.tsx`: The controls where you choose your destination, days, and spaceship armor.
- `src/components/DoseTimeline.tsx`: The chart that draws your radiation buildup day-by-day.
- `src/components/RiskSummary.tsx`: The score card that tells you if your crew passed NASA's safety limits.
- `src/components/SpaceWeatherPanel.tsx`: The live box showing real-time satellite data from NOAA.
- `src/components/AdityaL1Panel.tsx`: The screen showing solar measurements from India's Aditya-L1 satellite.
- `src/components/StormScenarioModal.tsx`: The pop-up window where you can test what happens during a solar storm.
- `src/components/SpaceIntroAnimation.tsx`: The 3D space starfield that plays when you first open the link.

### 2. backend (The engine that does the math)
This is built with Python and FastAPI.
- `app/main.py`: The web server that receives your mission settings and sends back results.
- `app/dose_engine.py`: The calculation code that figures out how much radiation gets through your spaceship walls based on real NASA Mars rover data.
- `app/weather_service.py`: The code that talks to NOAA satellites to get live space weather.
- `app/aditya_service.py`: The code that loads solar data from ISRO's Aditya-L1 spacecraft.
- `app/constants.py`: Official numbers, including NASA safety limits and material densities.

---

## How to run it on your own computer

You will need Python and Node.js installed.

### Step 1: Start the backend server
Open a terminal inside the project folder:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Your backend engine is now running at `http://127.0.0.1:8000`.

### Step 2: Start the frontend website
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://127.0.0.1:5173` in your web browser. You can now use the AstroShield Mission Console!

---

## Where does the science come from?

The math in this project is based on real space missions:
- **NASA Curiosity Rover (MSL RAD):** Carried a radiation sensor all the way to Mars in 2012, measuring exactly how much radiation hits a spaceship in deep space.
- **China Chang'e-4 Moon Lander:** Measured real radiation levels on the surface of the Moon in 2019.
- **NASA Standard 3001:** The official astronaut health standard that sets the 600 mSv career radiation ceiling.

---

## Simple Disclaimer

AstroShield is a learning and planning tool created for the ASTRA 2026 Hackathon. It uses real science and satellite numbers to show how spaceship shielding works in an easy-to-understand way.
