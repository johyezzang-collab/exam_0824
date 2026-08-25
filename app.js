const STORAGE_KEY = "todo-list-items";

let todos = loadTodos();
let currentFilter = "all";

const inputEl = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const listEl = document.getElementById("todo-list");
const itemsLeftEl = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter-btn");

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todos.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    text: trimmed,
    done: false,
  });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  saveTodos();
  render();
}

function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.done);
  if (currentFilter === "completed") return todos.filter((t) => t.done);
  return todos;
}

function render() {
  const filtered = getFilteredTodos();
  listEl.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-msg";
    empty.textContent = "표시할 항목이 없습니다.";
    empty.style.listStyle = "none";
    listEl.appendChild(empty);
  } else {
    filtered.forEach((todo) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.done;
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const span = document.createElement("span");
      span.className = "todo-text" + (todo.done ? " done" : "");
      span.textContent = todo.text;
      span.addEventListener("click", () => toggleTodo(todo.id));

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      listEl.appendChild(li);
    });
  }

  const remaining = todos.filter((t) => !t.done).length;
  itemsLeftEl.textContent = `${remaining}개 남음`;
}

addBtn.addEventListener("click", () => {
  addTodo(inputEl.value);
  inputEl.value = "";
  inputEl.focus();
});

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo(inputEl.value);
    inputEl.value = "";
  }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
