document.addEventListener("DOMContentLoaded", () => {
  const lamps = [...document.querySelectorAll(".lamp")];
  const stepBtn = document.getElementById("stepBtn");

  // storage keys
  const KEY_LIGHT = "light";
  const KEY_AUTO  = "auto";
  const KEY_SPEED = "speed";
  const KEY_DIR   = "dir"; // "forward" | "reverse"

  // auto sequences
  const SEQ_FORWARD = ["red", "amber", "green", "amber"];   // loop
  const SEQ_REVERSE = ["green", "amber", "red", "amber"];   // loop

  let timer = null;
  let current = localStorage.getItem(KEY_LIGHT) || "red";

  function setLight(color) {
    current = color;
    localStorage.setItem(KEY_LIGHT, color);

    lamps.forEach(btn => btn.classList.toggle("on", btn.dataset.color === color));

    stepBtn.classList.remove("is-red", "is-amber", "is-green");
    stepBtn.classList.add(`is-${color}`);
  }

  function autoTick() {
    const dir = localStorage.getItem(KEY_DIR) || "forward";
    const seq = (dir === "reverse") ? SEQ_REVERSE : SEQ_FORWARD;

    const i = seq.indexOf(current);
    const next = seq[(i === -1 ? 0 : (i + 1) % seq.length)];
    setLight(next);
  }

  function startOrStopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    const auto = localStorage.getItem(KEY_AUTO) === "true";
    if (!auto) return;

    const speed = Number(localStorage.getItem(KEY_SPEED)) || 900;
    timer = setInterval(autoTick, speed);
  }

  // Tap any lamp sets that lamp (auto keeps running)
  lamps.forEach(btn => {
    btn.addEventListener("click", () => setLight(btn.dataset.color));
  });

  // STEP behavior:
  // red -> green (skip amber)
  // green -> red (skip amber)
  // amber -> do nothing
  stepBtn.addEventListener("click", () => {
    if (current === "red") setLight("green");
    else if (current === "green") setLight("red");
    else {
      // amber: do nothing
    }
  });

  // If config changes while this page is open (or in another tab), update auto
  window.addEventListener("storage", (e) => {
    if ([KEY_AUTO, KEY_SPEED, KEY_DIR].includes(e.key)) startOrStopAuto();
    if (e.key === KEY_LIGHT && e.newValue) setLight(e.newValue);
  });

  // init
  setLight(current);
  startOrStopAuto();
});