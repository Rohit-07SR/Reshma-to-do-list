const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks with serial number and edit icon
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    li.dataset.index = index;

    // Create serial number
    const serial = document.createElement("div");
    serial.className = "task-serial";
    serial.textContent = index + 1;

    // Task text span
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;
    taskText.title = "Click edit icon to modify";

    // Editable input (hidden by default)
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "task-edit-input";
    editInput.value = task.text;
    editInput.style.display = "none";

    // Controls div
    const controls = document.createElement("div");
    controls.className = "task-controls";

    // Completed checkbox
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

    // Append all to list item
    li.appendChild(serial);
    li.appendChild(taskText);
    li.appendChild(editInput);
    li.appendChild(controls);

    taskList.appendChild(li);

    // Edit functionality
    editIcon.addEventListener("click", () => {
      taskText.style.display = "none";
      editInput.style.display = "block";
      editInput.focus();
      editInput.select();
    });

    // Save edit on enter or blur
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

// Save the edited task text
function saveEdit(index, newText, taskText, editInput) {
  if (newText === "") {
    alert("Task name cannot be empty.");
    editInput.focus();
    return;
  }
  tasks[index].text = newText;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskText.textContent = newText;
  editInput.style.display = "none";
  taskText.style.display = "block";
  renderTasks(); // Re-render to update serial numbers
}

// Cancel editing
function cancelEdit(taskText, editInput) {
  editInput.style.display = "none";
  taskText.style.display = "block";
  editInput.value = taskText.textContent;
}

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") {
    alert("Please enter a task.");
    return;
  }
  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveAndRender();
});

taskList.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    const idx = e.target.dataset.index;
    tasks[idx].completed = e.target.checked;
    saveAndRender();
  }
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const idx = e.target.dataset.index;
    tasks.splice(idx, 1);
    saveAndRender();
  }
});

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Initial render
renderTasks();
