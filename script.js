document.addEventListener("DOMContentLoaded", () => {
  const lamps = [...document.querySelectorAll(".lamp")];
  const stepBtn = document.getElementById("stepBtn");

  // Storage keys
  const KEY_LIGHT = "light";        // red | amber | green
  const KEY_AUTO  = "auto";         // "true" | "false"
  const KEY_SPEED = "speed";        // ms
  const KEY_DIR   = "dir";          // forward | reverse
  const KEY_AMBER_TO = "amberTo";   // red | green

  let timer = null;
  let stepping = false;

  /* ---------- Helpers ---------- */

  function getLight() {
    const on = lamps.find(l => l.classList.contains("on"));
    return on ? on.dataset.color : (localStorage.getItem(KEY_LIGHT) || "red");
  }

  function setLight(color) {
    localStorage.setItem(KEY_LIGHT, color);
    lamps.forEach(l => l.classList.toggle("on", l.dataset.color === color));

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

  function getDir() {
    return localStorage.getItem(KEY_DIR) === "reverse" ? "reverse" : "forward";
  }

  function setAmberTo(target) {
    localStorage.setItem(KEY_AMBER_TO, target);
  }

  function getAmberTo() {
    const v = localStorage.getItem(KEY_AMBER_TO);
    if (v === "red" || v === "green") return v;
    return getDir() === "reverse" ? "red" : "green";
  }

  /* ---------- AUTO (one state at a time) ---------- */

  function autoAdvance() {
    const current = getLight();

    if (current === "red") {
      setAmberTo("green");
      setLight("amber");
    } else if (current === "green") {
      setAmberTo("red");
      setLight("amber");
    } else {
      setLight(getAmberTo());
    }
  }

  function startOrStopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    if (localStorage.getItem(KEY_AUTO) !== "true") return;

    const speed = Number(localStorage.getItem(KEY_SPEED)) || 900;
    timer = setInterval(autoAdvance, speed);
  }

  /* ---------- STEP (two states with visible amber) ---------- */

  function stepJumpTwo() {
    if (stepping) return;
    stepping = true;

    const current = getLight();
    const AMBER_DELAY = 2000; // ms (adjust if you want)

    if (current === "red") {
      setAmberTo("green");
    } else if (current === "green") {
      setAmberTo("red");
    }

    if (current === "amber") {
      setLight(getAmberTo());
      stepping = false;
      return;
    }

    // Step 1: go to amber
    setLight("amber");

    // Step 2: go to endpoint after delay
    setTimeout(() => {
      setLight(current === "red" ? "green" : "red");
      stepping = false;
    }, AMBER_DELAY);
  }

  /* ---------- Events ---------- */

  lamps.forEach(l => {
    l.addEventListener("click", () => {
      stopAuto();
      setLight(l.dataset.color);

      if (l.dataset.color === "red") setAmberTo("green");
      if (l.dataset.color === "green") setAmberTo("red");
    });
  });

  if (stepBtn) {
    stepBtn.addEventListener("click", () => {
      stopAuto();
      stepJumpTwo();
    });
  }

  window.addEventListener("storage", (e) => {
    if ([KEY_AUTO, KEY_SPEED, KEY_DIR].includes(e.key)) {
      startOrStopAuto();
    }
    if (e.key === KEY_LIGHT && e.newValue) {
      setLight(e.newValue);
    }
  });

  /* ---------- Init ---------- */

  const initial = localStorage.getItem(KEY_LIGHT) || "red";
  setLight(initial);

  if (initial === "red") setAmberTo("green");
  if (initial === "green") setAmberTo("red");

  startOrStopAuto();
});