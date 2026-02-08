document.addEventListener("DOMContentLoaded", () => {

  const lamps = [...document.querySelectorAll(".lamp")];
  const stepBtn = document.getElementById("stepBtn");

  const ORDER = ["red", "amber", "green"];
  let current = localStorage.getItem("light") || "red";

  function setLight(color){
    lamps.forEach(l => {
      l.classList.toggle("on", l.dataset.color === color);
    });
    current = color;
    localStorage.setItem("light", color);
  }

  function step(){
    const i = ORDER.indexOf(current);
    setLight(ORDER[(i + 1) % ORDER.length]);
  }

  lamps.forEach(lamp => {
    lamp.addEventListener("click", () => {
      setLight(lamp.dataset.color);
    });
  });

  stepBtn.addEventListener("click", step);

  setLight(current);
});