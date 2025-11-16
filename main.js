// ===== IMPORTS =====
import { createTask, updateTask } from "./tasks.js";
import { saveTasks, loadTasks } from "./storage.js";
import { openModal, closeModal, getModalData, onSave } from "./modal.js";

// ===== DOM ELEMENTS =====
const todoColumn = document.getElementById("todo");
const doingColumn = document.getElementById("doing");
const doneColumn = document.getElementById("done");
const addTaskBtn = document.querySelector(".add-task");

let tasks = loadTasks();

// ===== RENDER TASKS =====
function renderTasks() {
  todoColumn.innerHTML = "";
  doingColumn.innerHTML = "";
  doneColumn.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.classList.add("task-card");
    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <div class="task-actions">
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    if (task.status === "todo") todoColumn.appendChild(div);
    if (task.status === "doing") doingColumn.appendChild(div);
    if (task.status === "done") doneColumn.appendChild(div);
  });

  setupButtons();
  saveTasks(tasks);
}

// ===== SETUP EDIT / DELETE BUTTONS =====
function setupButtons() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const task = tasks.find(t => t.id === id);
      openModal(task);
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    });
  });
}

// ===== ADD TASK =====
addTaskBtn.addEventListener("click", () => {
  openModal();
});

// ===== SAVE TASK (CREATE OR EDIT) =====
onSave(() => {
  const data = getModalData();

  if (data.id) {
    // Editing task
    tasks = tasks.map(t =>
      t.id === data.id
        ? { ...t, title: data.title, description: data.description }
        : t
    );
  } else {
    // Creating task
    const newTask = createTask(data.title, data.description);
    tasks.push(newTask);
  }

  closeModal();
  renderTasks();
});

// ===== INITIAL RENDER =====
renderTasks();
