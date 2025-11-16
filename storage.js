// ===== LOCAL STORAGE HANDLING =====

const STORAGE_KEY = "tasks-app";

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function loadTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
