export interface GlossaryEntry {
  title: string;
  simpleDef: string;
  analogy: string;
  funFact?: string;
  unit?: string;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  gcr: {
    title: "Galactic Cosmic Rays (GCR)",
    simpleDef: "Super-fast atomic bullets shooting from exploded stars far across the galaxy. They travel at nearly the speed of light and fly through deep space non-stop.",
    analogy: "Think of GCR like constant, invisible cosmic rain that falls day and night on spaceships.",
    funFact: "Because they travel so fast, they easily pass through regular metal spaceship walls!"
  },
  spe: {
    title: "Solar Particle Events (SPE)",
    simpleDef: "Giant explosions on the Sun that spray millions of speeding protons into space. They are rare, but can strike like a surprise tsunami.",
    analogy: "Like a sudden violent space thunderstorm with intense radiation lightning.",
    funFact: "During a big solar storm, astronauts must quickly hide in an emergency storm bunker."
  },
  msv: {
    title: "Millisievert (mSv)",
    simpleDef: "The official scientific unit used to measure how much radiation a living body absorbs.",
    analogy: "Like counting calories, but for measuring how much invisible space energy your body absorbs.",
    funFact: "A chest X-ray on Earth gives ~0.1 mSv. A 6-month trip to Mars gives ~300 mSv!"
  },
  effective_dose: {
    title: "Effective Dose (E)",
    simpleDef: "The radiation amount calculated for what your human organs (like bone marrow and lungs) actually absorb and feel.",
    analogy: "If raw radiation is like loud music in a room, Effective Dose is what your ears and body actually hear.",
    funFact: "NASA's 600 mSv lifetime career limit is written in Effective Dose."
  },
  dose_equivalent: {
    title: "Dose Equivalent (H)",
    simpleDef: "The raw physical radiation reading picked up by a space sensor or detector instrument.",
    analogy: "Like how loud a speaker is turned up, before your body absorbs it.",
    funFact: "In space, human bodies absorb about 65% of this raw sensor measurement (E/H ≈ 0.65)."
  },
  proton_flux: {
    title: "Proton Flux (>10 MeV in pfu)",
    simpleDef: "Measures how many speeding protons are flying past a tiny square of space every second.",
    analogy: "Like counting raindrops falling through an open window.",
    unit: "pfu (particle flux units)",
    funFact: "Normal space has under 10 pfu. Monster solar storms can blast over 10,000 pfu!"
  },
  kp_index: {
    title: "Planetary Kp Index",
    simpleDef: "A score from 0 to 9 measuring how much the solar wind is shaking Earth's magnetic bubble.",
    analogy: "Like a wind meter for space. 0-4 is a calm breeze; 5 or higher is a stormy magnetic gale!",
    funFact: "When Kp is high, you can see bright Northern Lights (auroras) dancing in the polar night sky!"
  },
  solar_flare: {
    title: "Solar Flare Power (A, B, C, M, X)",
    simpleDef: "Giant bright flashes of light and X-rays erupting on the surface of the Sun.",
    analogy: "Like volcano eruptions on the Sun: C is a puff, M is a big blast, and X is a super-volcano!",
    funFact: "A single large solar flare can release as much energy as millions of hydrogen bombs!"
  },
  noaa_s_scale: {
    title: "NOAA Space Radiation Storm Scale (S0 - S5)",
    simpleDef: "The official danger rating for radiation in deep space, from S0 (quiet) to S5 (extreme super-storm).",
    analogy: "Just like category 1 to 5 ratings for hurricanes, but for radiation in outer space!",
    funFact: "At S3 or higher, astronauts must immediately retreat into their reinforced storm bunker."
  },
  areal_density: {
    title: "Areal Density (g/cm²)",
    simpleDef: "How many grams a one-centimeter square slice of your spaceship wall weighs.",
    analogy: "A measure of how thick and heavy your spaceship armor is.",
    unit: "g/cm²",
    funFact: "Heavier walls stop more radiation, but rockets need more fuel to launch heavy walls into orbit!"
  },
  hdpe: {
    title: "High-Density Polyethylene Plastic (HDPE)",
    simpleDef: "A special hydrogen-rich plastic that is the #1 best radiation shield material in the world.",
    analogy: "Hydrogen atoms act like soft, fluffy cushions: they gently catch speeding particles without breaking!",
    funFact: "Unlike heavy metals, plastic does not create dangerous secondary neutron dust."
  },
  water_shield: {
    title: "Water Tank Shielding (H2O)",
    simpleDef: "Using the spaceship's drinking water tanks to line the walls around astronaut sleeping quarters.",
    analogy: "A clever 2-in-1 space trick: water blocks cosmic rays AND gives the crew clean drinking water!",
    funFact: "Water contains two hydrogen atoms per molecule, making it an awesome particle stopper."
  },
  regolith: {
    title: "Planetary Regolith (Moon & Mars Soil)",
    simpleDef: "The dusty soil and rock covering the surfaces of the Moon and Mars.",
    analogy: "Free space construction dirt! You can shovel it over an inflatable moonbase to make a thick hill.",
    funFact: "A 2-meter layer of lunar soil blocks over 90% of all space radiation."
  },
  secondary_neutrons: {
    title: "Secondary Neutrons & Buildup",
    simpleDef: "When fast cosmic rays hit heavy metal atoms like aluminium, they smash them like bowling balls into pins, creating lots of tiny dangerous neutron fragments!",
    analogy: "Imagine breaking a big glass bottle into a thousand sharp flying splinters.",
    funFact: "This is why making metal walls too thick can actually increase radiation inside a spaceship!"
  },
  aditya_l1: {
    title: "India's Aditya-L1 Spacecraft",
    simpleDef: "India's solar observatory stationed 1.5 million kilometers out from Earth towards the Sun.",
    analogy: "Like a lighthouse keeper watching the ocean for storm waves before they hit the shore.",
    funFact: "Because it is closer to the Sun, it spots solar storms 30 to 60 minutes before they reach Earth!"
  },
  lagrange_l1: {
    title: "Sun-Earth L1 Lagrange Point",
    simpleDef: "A gravitational parking spot in space where the gravity of the Sun and Earth balance out.",
    analogy: "A cosmic balancing point where a satellite can hover forever with very little rocket fuel.",
    funFact: "It is located about 1.5 million kilometers sunward from Earth (about 4 times farther than the Moon!)."
  },
  aspex: {
    title: "ASPEX Instrument (Aditya-L1)",
    simpleDef: "The particle spectrometer on Aditya-L1 that counts flying protons and ions heading from the Sun.",
    analogy: "A space speed-radar gun counting how many energetic particles are shooting through space.",
    funFact: "It detected the historic May 2024 solar storm that lit up auroras across the globe!"
  },
  solexs: {
    title: "SoLEXS Instrument (Aditya-L1)",
    simpleDef: "A high-speed X-ray camera on Aditya-L1 that monitors the Sun to detect solar flares instantly.",
    analogy: "Like taking continuous X-ray snapshots of the Sun's fiery atmosphere.",
    funFact: "It watches soft X-rays between 2 and 22 keV to catch flares the second they erupt."
  },
  nasa_career_limit: {
    title: "NASA Lifetime Safety Limit (600 mSv)",
    simpleDef: "NASA's strict rule: an astronaut cannot absorb more than 600 mSv across their entire lifetime career.",
    analogy: "A lifetime radiation safety bank account that an astronaut can never overspend.",
    funFact: "This limit keeps the lifetime risk of excess cancer mortality below 3%."
  },
  nasa_30day_limit: {
    title: "NASA 30-Day Emergency Limit (250 mSv)",
    simpleDef: "NASA's short-term limit to prevent immediate sickness (like nausea or white-blood-cell drops) during a solar storm.",
    analogy: "A speed bump to make sure astronauts don't get too much radiation all at once in one month.",
    funFact: "Staying inside a storm bunker during an SPE keeps astronauts safely under this limit."
  },
  solar_cycle: {
    title: "Solar Cycle (11-Year Sun Heartbeat)",
    simpleDef: "The Sun's magnetic activity waxes and wanes every 11 years between Solar Minimum and Solar Maximum.",
    analogy: "Like the Sun breathing in and out: sometimes it is calm, sometimes it is stormy!",
    funFact: "During Solar Minimum, the Sun's magnetic shield is weak, so MORE deep-space cosmic rays enter!"
  },
  storm_shelter: {
    title: "Emergency Storm Bunker",
    simpleDef: "A heavily armored, compact safe room inside the spaceship where astronauts sleep and shelter during solar storms.",
    analogy: "Like a tornado shelter in your basement, but for solar radiation in deep space!",
    funFact: "Water tanks and food supplies are often placed around the walls of the bunker for extra protection."
  }
};
