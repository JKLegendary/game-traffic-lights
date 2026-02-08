document.addEventListener("DOMContentLoaded", () => {
  const autoToggle = document.getElementById("autoToggle");
  const speedSelect = document.getElementById("speedSelect");
  const dirBtn = document.getElementById("dirBtn");

  const KEY_AUTO  = "auto";
  const KEY_SPEED = "speed";
  const KEY_DIR   = "dir";

  // load saved
  const auto = localStorage.getItem(KEY_AUTO) === "true";
  const speed = localStorage.getItem(KEY_SPEED) || "900";
  const dir = localStorage.getItem(KEY_DIR) || "forward";

  autoToggle.checked = auto;
  speedSelect.value = speed;
  dirBtn.textContent = (dir === "reverse") ? "Reverse" : "Forward";

  // save
  autoToggle.addEventListener("change", () => {
    localStorage.setItem(KEY_AUTO, String(autoToggle.checked));
  });

  speedSelect.addEventListener("change", () => {
    localStorage.setItem(KEY_SPEED, String(speedSelect.value));
  });

  dirBtn.addEventListener("click", () => {
    const now = (localStorage.getItem(KEY_DIR) || "forward");
    const next = (now === "forward") ? "reverse" : "forward";
    localStorage.setItem(KEY_DIR, next);
    dirBtn.textContent = (next === "reverse") ? "Reverse" : "Forward";
  });
});