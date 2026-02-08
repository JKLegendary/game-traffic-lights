document.addEventListener("DOMContentLoaded", () => {
  const lamps = [...document.querySelectorAll(".lamp")];
  const stepBtn = document.getElementById("stepBtn");

  // storage keys
  const KEY_LIGHT    = "light";      // "red" | "amber" | "green"
  const KEY_AUTO     = "auto";       // "true" | "false"
  const KEY_SPEED    = "speed";      // ms
  const KEY_DIR      = "dir";        // "forward" | "reverse"
  const KEY_AMBER_TO = "amberTo";    // where amber should go next: "red" | "green"

  let timer = null;

  function getLight() {
    const on = lamps.find(b => b.classList.contains("on"));
    return on ? on.dataset.color : (localStorage.getItem(KEY_LIGHT) || "red");
  }

  function setLight(color) {
    localStorage.setItem(KEY_LIGHT, color);
    lamps.forEach(btn => btn.classList.toggle("on", btn.dataset.color === color));

    // mini step button highlight (if using it)
    if (stepBtn) {
      stepBtn.classList.remove("is-red", "is-amber", "is-green");
      stepBtn.classList.add(`is-${color}`);
    }
  }

  function dir() {
    return (localStorage.getItem(KEY_DIR) === "reverse") ? "reverse" : "forward";
  }

  function setAmberTo(target) {
    localStorage.setItem(KEY_AMBER_TO, target === "red" ? "red" : "green");
  }

  function amberTo() {
    const v = localStorage.getItem(KEY_AMBER_TO);
    return (v === "red" || v === "green") ? v : (dir() === "reverse" ? "red" : "green");
  }

  // ---------- AUTO: proper state machine (no indexOf, no duplicates bug) ----------
  function autoAdvanceOneState() {
    const current = getLight();
    const d = dir();

    // ensure amber knows where it's heading next
    if (current === "red") setAmberTo("green");
    if (current === "green") setAmberTo("red");

    if (current === "red") {
      setLight("amber");
    } else if (current === "green") {
      setLight("amber");
    } else { // amber
      // amber goes to the remembered endpoint
      setLight(amberTo());
    }
  }

  function startOrStopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    const isAuto = localStorage.getItem(KEY_AUTO) === "true";
    if (!isAuto) return;

    const speed = Number(localStorage.getItem(KEY_SPEED)) || 900;
    timer = setInterval(autoAdvanceOneState, speed);
  }

  // ---------- STEP: jump TWO states ----------
  // What you want:
  // - forward jump: red -> green (skipping amber stop)
  // - reverse jump: green -> red (skipping amber stop)
  // - if on amber: go to the endpoint for the current direction/memory
  function stepJumpTwo() {
    const current = getLight();
    const d = dir();

    // Keep amber memory sane
    if (current === "red") setAmberTo("green");
    if (current === "green") setAmberTo("red");

    if (current === "amber") {
      // on amber, a "2-step" jump really just means go to the endpoint
      setLight(amberTo());
      return;
    }

    // From red or green, do two transitions instantly:
    // red -> amber -> green OR green -> amber -> red
    setLight("amber");

    // next tick immediately to endpoint
    const endpoint = (current === "red") ? "green" : "red";
    // lock memory so auto remains consistent afterwards
    setAmberTo(endpoint);
    setLight(endpoint);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    localStorage.setItem(KEY_AUTO, "false");
  }

  // Tap lamps = manual set (and stop auto so it doesn't fight)
  lamps.forEach(btn => {
    btn.addEventListener("click", () => {
      stopAuto();
      const c = btn.dataset.color;
      setLight(c);

      // set amber memory based on endpoints
      if (c === "red") setAmberTo("green");
      if (c === "green") setAmberTo("red");
    });
  });

  // Step button = do the 2-step jump (also stop auto so it doesn't interfere)
  if (stepBtn) {
    stepBtn.addEventListener("click", () => {
      stopAuto();
      stepJumpTwo();
    });
  }

  // react to config changes (auto settings)
  window.addEventListener("storage", (e) => {
    if ([KEY_AUTO, KEY_SPEED, KEY_DIR].includes(e.key)) startOrStopAuto();
    if (e.key === KEY_LIGHT && e.newValue) setLight(e.newValue);
  });

  // init
  const initial = localStorage.getItem(KEY_LIGHT) || "red";
  setLight(initial);
  if (initial === "red") setAmberTo("green");
  if (initial === "green") setAmberTo("red");
  startOrStopAuto();
});