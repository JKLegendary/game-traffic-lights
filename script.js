const STORAGE_KEY = "trafficLight.selected";
const lamps = Array.from(document.querySelectorAll(".lamp"));

function setOn(color) {
  lamps.forEach(btn => {
    btn.classList.toggle("on", btn.dataset.color === color);
  });
  try { localStorage.setItem(STORAGE_KEY, color); } catch {}
}

function loadInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && lamps.some(b => b.dataset.color === saved)) return saved;
  } catch {}
  return "red";
}

lamps.forEach(btn => {
  btn.addEventListener("click", () => setOn(btn.dataset.color));
});

// Start with saved (or red)
setOn(loadInitial());