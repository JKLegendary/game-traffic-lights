const STORAGE_KEY = "gameTrafficLights.v1";

const listEl = document.getElementById("list");
const inputEl = document.getElementById("newGame");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {
      games: [
        { name: "Example Game", status: "green" },
        { name: "Another Game", status: "amber" }
      ]
    };
    return JSON.parse(raw);
  } catch {
    return { games: [] };
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = load();

function setStatus(index, status) {
  state.games[index].status = status;
  save(state);
  render();
}

function removeGame(index) {
  state.games.splice(index, 1);
  save(state);
  render();
}

function addGame(name) {
  const trimmed = name.trim();
  if (!trimmed) return;

  // prevent exact duplicates (case-insensitive)
  const exists = state.games.some(g => g.name.toLowerCase() === trimmed.toLowerCase());
  if (exists) return;

  state.games.unshift({ name: trimmed, status: "amber" });
  save(state);
  render();
}

function render() {
  listEl.innerHTML = "";

  state.games.forEach((game, i) => {
    const li = document.createElement("li");
    li.className = "item";

    const left = document.createElement("div");
    left.className = "name";
    left.textContent = game.name;

    const right = document.createElement("div");
    right.className = "actions";

    const lights = document.createElement("div");
    lights.className = "lights";

    ["red", "amber", "green"].forEach(color => {
      const dot = document.createElement("div");
      dot.className = `light ${color}` + (game.status === color ? " active" : "");
      dot.title = color.toUpperCase();
      dot.addEventListener("click", () => setStatus(i, color));
      lights.appendChild(dot);
    });

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.addEventListener("click", () => removeGame(i));

    right.appendChild(lights);
    right.appendChild(del);

    li.appendChild(left);
    li.appendChild(right);

    listEl.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  addGame(inputEl.value);
  inputEl.value = "";
  inputEl.focus();
});

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addGame(inputEl.value);
    inputEl.value = "";
  }
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state = load();
  render();
});

render();
