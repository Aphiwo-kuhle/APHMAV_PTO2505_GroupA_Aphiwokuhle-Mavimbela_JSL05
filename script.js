/**
 * Kanban Board – Full JSL05 Solution
 * Includes: Add, View, Edit, Delete, Modal Modes, LocalStorage Persistence
 */

const STORAGE_KEY = "kanban.tasks";

/** Generate unique id */
function uid() {
  return crypto.randomUUID ? crypto.randomUUID() :
      "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Load tasks or create seed data */
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }

  const seed = [
    { id: uid(), title: "Launch Epic Career 🚀", desc: "Define roadmap.", status: "todo" },
    { id: uid(), title: "Master JavaScript 💛", desc: "Deep JS study.", status: "doing" },
    { id: uid(), title: "Have fun 😺", desc: "Enjoy learning!", status: "done" },
  ];
  saveTasks(seed);
  return seed;
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(data) {
  const tasks = loadTasks();
  const task = { id: uid(), ...data };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

function updateTask(id, changes) {
  const tasks = loadTasks();
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return;
  tasks[i] = { ...tasks[i], ...changes };
  saveTasks(tasks);
}

function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}

function getTask(id) {
  return loadTasks().find(t => t.id === id);
}

/* ---------------- Rendering ---------------- */

function renderBoard() {
  const tasks = loadTasks();

  const todo = tasks.filter(t => t.status === "todo");
  const doing = tasks.filter(t => t.status === "doing");
  const done = tasks.filter(t => t.status === "done");

  paintList("todoList", todo);
  paintList("doingList", doing);
  paintList("doneList", done);

  document.getElementById("todoTitle").textContent = `TODO (${todo.length})`;
  document.getElementById("doingTitle").textContent = `DOING (${doing.length})`;
  document.getElementById("doneTitle").textContent = `DONE (${done.length})`;
}

function paintList(id, tasks) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  tasks.forEach(t => list.appendChild(taskCard(t)));
}

function taskCard(task) {
  const el = document.createElement("article");
  el.className = "task";
  el.dataset.id = task.id;

  el.innerHTML = `
    <h3 class="task-title">${task.title}</h3>
    <p class="task-desc">${task.desc || "No description"}</p>
  `;
  return el;
}

/* ---------------- Modal ---------------- */

let $modal, $form, $title, $desc, $status, $idHidden;
let $btnCreate, $btnEdit, $btnDelete;

function initModal() {
  $modal = document.getElementById("modal");
  $form = document.getElementById("taskForm");
  $title = document.getElementById("title");
  $desc = document.getElementById("desc");
  $status = document.getElementById("status");
  $idHidden = document.getElementById("taskId");

  $btnCreate = document.getElementById("primaryAction");
  $btnEdit = document.getElementById("editAction");
  $btnDelete = document.getElementById("deleteAction");

  document.getElementById("closeModal").onclick = hideModal;
  $modal.onclick = (e) => { if (e.target === $modal) hideModal(); };

  // CREATE or SAVE
  $form.onsubmit = (e) => {
    e.preventDefault();

    const id = $idHidden.value.trim();
    const title = $title.value.trim();
    const desc = $desc.value.trim();
    const status = $status.value;

    if (!title) return alert("Title required!");

    if (!id) {
      addTask({ title, desc, status });
    } else {
      updateTask(id, { title, desc, status });
    }

    renderBoard();
    hideModal();
  };

  // ENTER EDIT MODE
  $btnEdit.onclick = () => setEditMode(true);

  // DELETE TASK
  $btnDelete.onclick = () => {
    const id = $idHidden.value;
    deleteTask(id);
    renderBoard();
    hideModal();
  };
}

function showModal() {
  $modal.classList.remove("hidden");
}

function hideModal() {
  $modal.classList.add("hidden");
}

function openCreateModal() {
  setEditMode(true);
  $idHidden.value = "";
  $title.value = "";
  $desc.value = "";
  $status.value = "todo";
  $btnCreate.textContent = "Create Task";
  $btnEdit.style.display = "none";
  $btnDelete.style.display = "none";
  showModal();
}

function openViewModal(taskId) {
  const t = getTask(taskId);
  if (!t) return;

  setEditMode(false);
  $idHidden.value = t.id;
  $title.value = t.title;
  $desc.value = t.desc;
  $status.value = t.status;

  $btnCreate.textContent = "Close";
  $btnEdit.style.display = "inline-block";
  $btnDelete.style.display = "inline-block";

  showModal();
}

function setEditMode(enabled) {
  [$title, $desc, $status].forEach(f => {
    f.disabled = !enabled;
  });
  $btnCreate.textContent = enabled ? "Save Task" : "Close";
}

/* ---------------- App Init ---------------- */

function init() {
  initModal();
  renderBoard();

  document.getElementById("addTaskTopRight").onclick = openCreateModal;
  document.getElementById("addTaskMobile").onclick = openCreateModal;
  document.getElementById("addTaskFab").onclick = openCreateModal;

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".task");
    if (card) openViewModal(card.dataset.id);
  });
}

document.addEventListener("DOMContentLoaded", init);
