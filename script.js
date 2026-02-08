document.addEventListener("DOMContentLoaded", () => {
  const lamps = [...document.querySelectorAll(".lamp")];
  const stepBtn = document.getElementById("stepBtn");

  // storage keys
  const KEY_LIGHT = "light";
  const KEY_AUTO  = "auto";
  const KEY_SPEED = "speed";
  const KEY_DIR   = "dir";      // config auto direction (forward|reverse)
  const KEY_STEP_DIR = "stepDir"; // step button direction (forward|reverse)

  // auto sequences (if you use auto)
  const SEQ_FORWARD = ["red", "amber", "green", "amber"];   // loop
  const SEQ_REVERSE = ["green", "amber", "red", "amber"];   // loop

  let timer = null;

  function getCurrent() {
    const on = lamps.find(b => b.classList.contains("on"));
    return on ? on.dataset.color : (localStorage.getItem(KEY_LIGHT) || "red");
  }

  function setLight(color) {
    localStorage.setItem(KEY_LIGHT, color);
    lamps.forEach(btn => btn.classList.toggle("on", btn.dataset.color === color));

    // update mini-step button highlight if present
    if (stepBtn) {
      stepBtn.classList.remove("is-red", "is-amber", "is-green");
      stepBtn.classList.add(`is-${color}`);
    }
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    localStorage.setItem(KEY_AUTO, "false");
  }

  function autoTick() {
    const current = getCurrent();
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

  // Tap lamps = manual override (also stops auto so it doesn't fight you)
  lamps.forEach(btn => {
    btn.addEventListener("click", () => {
      stopAuto();
      setLight(btn.dataset.color);

      // set step direction based on what you chose
      if (btn.dataset.color === "red") localStorage.setItem(KEY_STEP_DIR, "forward");
      if (btn.dataset.color === "green") localStorage.setItem(KEY_STEP_DIR, "reverse");
    });
  });

  // ✅ STEP BUTTON: EXACT BEHAVIOR YOU DESCRIBED
  // Red -> Amber -> Green (forward)
  // Green -> Amber -> Red (reverse)
  // Amber continues whichever direction you were going last
  stepBtn.addEventListener("click", () => {
    stopAuto(); // stop auto so step is consistent

    const current = getCurrent();

    // If you're at an end, force direction
    if (current === "red") localStorage.setItem(KEY_STEP_DIR, "forward");
    if (current === "green") localStorage.setItem(KEY_STEP_DIR, "reverse");

    const stepDir = localStorage.getItem(KEY_STEP_DIR) || "forward";

    if (current === "red") {
      setLight("amber");
    } else if (current === "amber") {
      setLight(stepDir === "forward" ? "green" : "red");
    } else if (current === "green") {
      setLight("amber");
    } else {
      // fallback
      setLight("red");
      localStorage.setItem(KEY_STEP_DIR, "forward");
    }
  });

  // react to config changes (auto settings)
  window.addEventListener("storage", (e) => {
    if ([KEY_AUTO, KEY_SPEED, KEY_DIR].includes(e.key)) startOrStopAuto();
    if (e.key === KEY_LIGHT && e.newValue) setLight(e.newValue);
  });

  // init
  const initial = localStorage.getItem(KEY_LIGHT) || "red";
  if (!localStorage.getItem(KEY_STEP_DIR)) {
    localStorage.setItem(KEY_STEP_DIR, initial === "green" ? "reverse" : "forward");
  }
  setLight(initial);
  startOrStopAuto();
});