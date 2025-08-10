// ===================== SNACKBAR FUNCTION =====================
function showSnackbar(message, type = "info", duration = 3000) {
  const container = document.getElementById("snackbar-container");
  if (!container) return; // Prevent errors if container missing

  const snackbar = document.createElement("div");
  snackbar.className = `snackbar ${type}`;
  snackbar.textContent = message;

  container.appendChild(snackbar);

  // Remove after duration + animation time
  setTimeout(() => {
    snackbar.remove();
  }, duration + 400);
}

// ===================== TASK VARIABLES =====================
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===================== RENDER TASKS =====================
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    li.dataset.index = index;

    // Serial number
    const serial = document.createElement("div");
    serial.className = "task-serial";
    serial.textContent = index + 1;

    // Task text
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;
    taskText.title = "Click edit icon to modify";

    // Editable input
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "task-edit-input";
    editInput.value = task.text;
    editInput.style.display = "none";

    // Controls container
    const controls = document.createElement("div");
    controls.className = "task-controls";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.dataset.index = index;

    // Edit icon
    const editIcon = document.createElement("span");
    editIcon.className = "material-icons edit-icon";
    editIcon.textContent = "edit";
    editIcon.title = "Edit task";

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.index = index;

    // Append controls
    controls.appendChild(checkbox);
    controls.appendChild(editIcon);
    controls.appendChild(deleteBtn);

    // Append everything
    li.appendChild(serial);
    li.appendChild(taskText);
    li.appendChild(editInput);
    li.appendChild(controls);
    taskList.appendChild(li);

    // ===================== EDIT FUNCTIONALITY =====================
    editIcon.addEventListener("click", () => {
      taskText.style.display = "none";
      editInput.style.display = "block";
      editInput.focus();
      editInput.select();
    });

    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdit(index, editInput.value.trim(), taskText, editInput);
      } else if (e.key === "Escape") {
        cancelEdit(taskText, editInput);
      }
    });

    editInput.addEventListener("blur", () => {
      saveEdit(index, editInput.value.trim(), taskText, editInput);
    });
  });
}

// ===================== SAVE EDIT =====================
function saveEdit(index, newText, taskText, editInput) {
  if (newText === "") {
    showSnackbar("Task name cannot be empty.", "warning");
    editInput.focus();
    return;
  }
  tasks[index].text = newText;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskText.textContent = newText;
  editInput.style.display = "none";
  taskText.style.display = "block";
  showSnackbar("Task edited successfully!", "success");
}

// ===================== CANCEL EDIT =====================
function cancelEdit(taskText, editInput) {
  editInput.style.display = "none";
  taskText.style.display = "block";
  editInput.value = taskText.textContent;
}

// ===================== ADD TASK =====================
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") {
    showSnackbar("Please enter a task.", "warning");
    return;
  }
  tasks.unshift({ text, completed: false });
  taskInput.value = "";
  saveAndRender();
  taskInput.focus();
  showSnackbar("Task added successfully!", "success");
});

// ===================== ADD TASK WITH ENTER =====================
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addBtn.click();
  }
});

// ===================== COMPLETE TASK =====================
taskList.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    const idx = e.target.dataset.index;
    tasks[idx].completed = e.target.checked;
    saveAndRender();
    if (tasks[idx].completed) {
      showSnackbar(`Task "${tasks[idx].text}" marked completed!`, "info");
    }
  }
});

// ===================== DELETE TASK =====================
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const idx = e.target.dataset.index;
    tasks.splice(idx, 1);
    saveAndRender();
    showSnackbar("Task deleted successfully!", "success");
  }
});

// ===================== SAVE & RENDER =====================
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// ===================== INITIAL RENDER =====================
renderTasks();
