const STORAGE_KEY = "trafficLight.v2"; // { color, dir, auto, speed }

const lamps = Array.from(document.querySelectorAll(".lamp"));
const stepBtn = document.getElementById("stepBtn");
const autoToggle = document.getElementById("autoToggle");
const speedSelect = document.getElementById("speedSelect");
const dirBtn = document.getElementById("dirBtn");

const ORDER = ["red", "amber", "green"]; // normal traffic light order

let timer = null;

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { color: "red", dir: 1, auto: false, speed: 900 };
    const parsed = JSON.parse(raw);
    return {
      color: parsed.color ?? "red",
      dir: (parsed.dir === -1 ? -1 : 1),
      auto: !!parsed.auto,
      speed: Number(parsed.speed) || 900
    };
  } catch {
    return { color: "red", dir: 1, auto: false, speed: 900 };
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function setOn(color) {
  state.color = color;
  lamps.forEach(btn => btn.classList.toggle("on", btn.dataset.color === color));
  saveState();
}

function step() {
  const idx = ORDER.indexOf(state.color);
  const nextIdx = (idx + state.dir + ORDER.length) % ORDER.length;
  setOn(ORDER[nextIdx]);
}

function setDirection(dir) {
  state.dir = (dir === -1 ? -1 : 1);
  dirBtn.textContent = state.dir === 1 ? "Forward" : "Reverse";
  saveState();
}

function setAuto(enabled) {
  state.auto = !!enabled;
  autoToggle.checked = state.auto;
  saveState();
  refreshAuto();
}

function setSpeed(ms) {
  state.speed = ms;
  speedSelect.value = String(ms);
  saveState();
  refreshAuto();
}

function refreshAuto() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (state.auto) {
    timer = setInterval(step, state.speed);
  }
}

/* Lamp taps: set that light (and stop auto? up to you)
   If you want taps to keep auto running, delete setAuto(false) below. */
lamps.forEach(btn => {
  btn.addEventListener("click", () => {
    setOn(btn.dataset.color);
    setAuto(false); // optional: manual tap disables auto
  });
});

/* Top-left Step button */
stepBtn.addEventListener("click", () => {
  step();
  setAuto(false); // stepping is manual, so stop auto
});

/* Panel controls */
autoToggle.addEventListener("change", () => setAuto(autoToggle.checked));

speedSelect.addEventListener("change", () => {
  const ms = Number(speedSelect.value);
  setSpeed(ms);
});

dirBtn.addEventListener("click", () => {
  setDirection(state.dir === 1 ? -1 : 1);
});

/* Init UI from saved state */
setDirection(state.dir);
setSpeed(state.speed);
setOn(state.color);
setAuto(state.auto);