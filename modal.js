// ===== MODAL LOGIC =====

const modal = document.querySelector(".modal");
const modalTitle = document.getElementById("task-title");
const modalDesc = document.getElementById("task-desc");
const modalSaveButton = document.querySelector(".save-task");

let editingTaskId = null;

export function openModal(task = null) {
  modal.style.display = "block";

  if (task) {
    editingTaskId = task.id;
    modalTitle.value = task.title;
    modalDesc.value = task.description;
  } else {
    editingTaskId = null;
    modalTitle.value = "";
    modalDesc.value = "";
  }
}

export function closeModal() {
  modal.style.display = "none";
}

export function getModalData() {
  return {
    title: modalTitle.value,
    description: modalDesc.value,
    id: editingTaskId
  };
}

export function onSave(callback) {
  modalSaveButton.addEventListener("click", callback);
}
