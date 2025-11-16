// ===== TASK FUNCTIONS =====

// Create a new task object
export function createTask(title, description) {
  return {
    id: Date.now(),
    title,
    description,
    status: "todo"
  };
}

// Update an existing task
export function updateTask(id, newTitle, newDescription) {
  return {
    id,
    title: newTitle,
    description: newDescription
  };
}
