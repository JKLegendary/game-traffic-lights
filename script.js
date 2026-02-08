const STORAGE_KEY = "trafficLight.selected"; // saves per device/browser
const lamps = Array.from(document.querySelectorAll(".lamp"));

function setOn(color) {
  lamps.forEach(btn => {
    btn.classList.toggle("on", btn.dataset.color === color);
  });
  localStorage.setItem(STORAGE_KEY, color);
}

function loadInitial() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && lamps.some(b => b.dataset.color === saved)) return saved;
  return "red"; // default
}

lamps.forEach(btn => {
  btn.addEventListener("click", () => setOn(btn.dataset.color));
});

// init
setOn(loadInitial());