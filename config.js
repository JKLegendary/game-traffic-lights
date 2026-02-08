document.addEventListener("DOMContentLoaded", () => {

  const autoToggle = document.getElementById("autoToggle");
  const speedSelect = document.getElementById("speedSelect");
  const dirBtn = document.getElementById("dirBtn");

  let auto = localStorage.getItem("auto") === "true";
  let speed = Number(localStorage.getItem("speed")) || 1000;
  let dir = localStorage.getItem("dir") || "forward";

  autoToggle.checked = auto;
  speedSelect.value = speed;
  dirBtn.textContent = dir === "forward" ? "Forward" : "Reverse";

  autoToggle.addEventListener("change", () => {
    localStorage.setItem("auto", autoToggle.checked);
  });

  speedSelect.addEventListener("change", () => {
    localStorage.setItem("speed", speedSelect.value);
  });

  dirBtn.addEventListener("click", () => {
    dir = dir === "forward" ? "reverse" : "forward";
    dirBtn.textContent = dir === "forward" ? "Forward" : "Reverse";
    localStorage.setItem("dir", dir);
  });
});
