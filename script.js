// Sample data structure to hold categories and tasks
let data = {
  categories: [],
  tasks: [],
  editMode: false, // Flag to indicate edit mode
  editIndex: null, // Index of the task being edited
  oldData: "",
  dataTask: []
};

// Function to add a new category
function addCategory() {
  const categoryInput = document.getElementById('categoryInput');
  const categoryName = categoryInput.value.trim();
  const oldData = data.oldData;
  if (categoryName === '') {
    alert('Please enter a category name.');
    return;
  }

  // Prepare data to be sent to addCategory.php
  const requestData = {
    name: categoryName,
    oldData: oldData
  };

  // Use AJAX to send data to addCategory.php
  if(data.editMode){
    data.editMode = false;
    fetch('editCategory.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server
        if (data.message) {
          data.editMode = false;
          alert(data.message);
          // Clear the input field
          categoryInput.value = '';
          // Update the UI
          displayCategories();
          displayTasks();
          updateCategorySelect();
        } else if (data.error) {
          data.editMode = false;
          alert(data.error);
        } else {
          alert('Unexpected response from the server.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }else{
    fetch('addCategory.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server
        if (data.message) {
          alert(data.message);
          // Clear the input field
          categoryInput.value = '';
          // Update the UI
          displayCategories();
          displayTasks();
          updateCategorySelect();
        } else if (data.error) {
          alert(data.error);
        } else {
          alert('Unexpected response from the server.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

// Function to delete a category
// Modifikasi fungsi deleteCategory() untuk mengeksekusi deleteCategory.php
function deleteCategory(index) {
  const deletedCategory = index;
  console.log(deletedCategory);
  // Fetch API untuk mengirim permintaan ke deleteCategory.php
  fetch('deleteCategory.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ category: deletedCategory }),
  })
    .then(response => response.json())
    .then(result => {
      if (result.message) {
        // Jika kategori dihapus berhasil, update data dan UI
        data.categories.splice(index, 1);
        data.tasks = data.tasks.filter(task => task.category !== deletedCategory);
        displayCategories();
        displayTasks();
        updateCategorySelect(); // Update category dropdown
      } else {
        // Jika terjadi kesalahan, tampilkan pesan kesalahan
        console.error(result.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// Function to edit a category
function editCategory(index) {
  const editedCategory = index;
  // Populate the category input with existing data
  const categoryInput = document.getElementById('categoryInput');
  categoryInput.value = editedCategory;
  data.oldData = index;
  // Set the edit mode and index
  data.editMode = true;
  data.editIndex = index;
  
  // Update the UI
  displayCategories();
}

// Function to update the category dropdown in the task form
function updateCategorySelect() {
  const categorySelect = document.getElementById('categorySelect');
  categorySelect.innerHTML = '';

  // Use AJAX to get categories from getCategories.php
  fetch('getCategories.php')
    .then(response => response.json())
    .then(categories => {
      // Add an option for each category
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to add a new task
function addTask() {
  const taskTitle = document.getElementById('taskTitle').value.trim();
  const taskDescription = document.getElementById('taskDescription').value.trim();
  const taskDeadline = document.getElementById('taskDeadline').value;
  const taskPriority = document.getElementById('taskPriority').value;

  if (taskTitle === '' || taskDeadline === '') {
    alert('Please enter a title and deadline for the task.');
    return;
  }

  const categorySelect = document.getElementById('categorySelect');
  const selectedCategory = categorySelect.value;

  const newTask = {
    title: taskTitle,
    description: taskDescription,
    deadline: taskDeadline,
    priority: taskPriority,
    category: selectedCategory
  };

  if (data.editMode) {
    // Edit existing task
    newTask.taskId = data.tasks[data.editIndex].id;
  }

  // Use AJAX to send data to saveTask.php
  fetch('saveTask.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      if (data.message) {
        alert(data.message);
        // Clear the input fields
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskDeadline').value = '';
        displayTasks();
        updateCategorySelect();
      } else if (data.error) {
        alert(data.error);
      } else {
        alert('Unexpected response from the server.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to display categories and tasks
// Function to display categories
function displayCategories() {
  const categoriesContainer = document.getElementById('categories');
  categoriesContainer.innerHTML = '';

  // Fetch data from the server
  fetch('getCategories.php')
    .then(response => response.json())
    .then(data => {
      // Display a table-like structure for categories
      if (data.length > 0) {
        const table = document.createElement('table');
        table.className = 'table table-bordered';

        // Table body
        const tbody = document.createElement('tbody');
        data.forEach((category, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${category}</td>
            <td>
              <button class="btn btn-danger mr-2" onclick="deleteCategory('${category}')">Delete</button>
              <button class="btn btn-primary" onclick="editCategory('${category}')">Edit</button>
            </td>
          `;
          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        categoriesContainer.appendChild(table);
      } else {
        categoriesContainer.textContent = 'No categories available.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// Function to display tasks
function displayTasks() {
  const tasksContainer = document.getElementById('tasks');
  tasksContainer.innerHTML = '';

  // Use AJAX to fetch tasks data from getTasks.php
  fetch('getTasks.php')
    .then(response => response.json())
    .then(tasksData => {
      // Assign tasksData to data.dataTask
      data.dataTask = tasksData;

      // Display a table-like structure for tasks
      if (data.dataTask.length > 0) {
        const table = document.createElement('table');
        table.className = 'table table-bordered';

        // Table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Title</th><th>Description</th><th>Deadline</th><th>Priority</th><th>Category</th><th>Action</th>';
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table body
        const tbody = document.createElement('tbody');
        data.dataTask.forEach((task, index, title) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.deadline}</td>
            <td>${task.priority}</td>
            <td>${task.category}</td>
            <td>
              <button class="btn btn-danger mr-2" onclick="deleteTask(${task.id}, '${task.title}')">Delete</button>
              <button class="btn btn-primary" onclick="editTask(${task.id})">Edit</button>
            </td>
          `;
          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tasksContainer.appendChild(table);
      } else {
        tasksContainer.textContent = 'No tasks available.';
      }

      // Display the task form
      const taskForm = document.getElementById('task-form');
      taskForm.innerHTML = `
        <h2 class="mb-4">${data.editMode ? 'Edit Task' : 'Add Task'}</h2>
        <label for="taskTitle">Title:</label>
        <input type="text" class="form-control mb-2" id="taskTitle" placeholder="Enter title">

        <label for="taskDescription">Description:</label>
        <textarea class="form-control mb-2" id="taskDescription" placeholder="Enter description"></textarea>

        <label for="taskDeadline">Deadline:</label>
        <input type="date" class="form-control mb-2" id="taskDeadline">

        <label for="taskPriority">Priority:</label>
        <select class="form-control mb-2" id="taskPriority">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <label for="categorySelect">Category:</label>
        <select class="form-control mb-2" id="categorySelect"></select>

        <button class="btn btn-success" onclick="saveTask()">Save</button>
        <button class="btn btn-secondary" onclick="cancelEdit()">Cancel</button>
      `;

      // Update the category dropdown in the task form
      updateCategorySelect();
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}


// Function to cancel editing a task
function cancelEdit() {
  // Reset edit mode and index
  data.editMode = false;
  data.editIndex = null;

  // Clear the input fields
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDeadline').value = '';
  document.getElementById('taskPriority').value = '';
  document.getElementById('categorySelect').value = '';

  // Update the UI
  displayTasks();
}

// Function to edit a task
function editTask(index) {
  const editedTask = data.tasks[index];
  // Populate the task form with existing data
  document.getElementById('taskTitle').value = editedTask.title;
  document.getElementById('taskDescription').value = editedTask.description;
  document.getElementById('taskDeadline').value = editedTask.deadline;
  document.getElementById('taskPriority').value = editedTask.priority;
  document.getElementById('categorySelect').value = editedTask.category;

  // Set the edit mode, index, and task ID
  data.editMode = true;
  data.editIndex = index;

  // Update the UI
  displayTasks();
  updateTaskForm(); // Update task form in edit mode
}

// Function to update the task form in edit mode
function updateTaskForm() {
  // Change the heading of the task form
  const taskFormHeading = document.querySelector('#task-form h2');
  taskFormHeading.textContent = 'Edit Task';

  // Change the label of the save button
  const saveButton = document.querySelector('#task-form button.btn-success');
  saveButton.textContent = 'Update';

  // Disable category selection during edit
  const categorySelect = document.getElementById('categorySelect');
  categorySelect.disabled = true;

  // Update the save button click event to call editTaskOnServer
  saveButton.removeEventListener('click', saveTask);
  saveButton.addEventListener('click', editTaskOnServer);
}

// Function to edit a task on the server
function editTaskOnServer() {
  const taskTitle = document.getElementById('taskTitle').value.trim();
  const taskDescription = document.getElementById('taskDescription').value.trim();
  const taskDeadline = document.getElementById('taskDeadline').value;
  const taskPriority = document.getElementById('taskPriority').value;

  if (taskTitle === '' || taskDeadline === '') {
    alert('Please enter a title and deadline for the task.');
    return;
  }

  const categorySelect = document.getElementById('categorySelect');
  const selectedCategory = categorySelect.value;

  const requestData = {
    id: data.tasks[data.editIndex].id, // Task ID to be updated
    title: taskTitle,
    description: taskDescription,
    deadline: taskDeadline,
    priority: taskPriority,
    category: selectedCategory
  };

  // Use AJAX to send data to editTask.php
  fetch('editTask.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      if (data.message) {
        alert(data.message);
        // Clear the input fields
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskDeadline').value = '';
        // Reset edit mode and index
        data.editMode = false;
        data.editIndex = null;
        // Enable category selection
        const categorySelect = document.getElementById('categorySelect');
        categorySelect.disabled = false;
        // Update the UI
        displayCategories();
        displayTasks();
        updateCategorySelect(); // Update category dropdown
      } else if (data.error) {
        alert(data.error);
      } else {
        alert('Unexpected response from the server.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to update the task form in edit mode
function updateTaskForm() {
  // Change the heading of the task form
  const taskFormHeading = document.querySelector('#task-form h2');
  taskFormHeading.textContent = 'Edit Task';

  // Change the label of the save button
  const saveButton = document.querySelector('#task-form button.btn-success');
  saveButton.textContent = 'Update';

  // Disable category selection during edit
  const categorySelect = document.getElementById('categorySelect');
  categorySelect.disabled = true;
}

// Function to save a task (called when adding or updating a task)
function saveTask() {
  const taskTitle = document.getElementById('taskTitle').value.trim();
  const taskDescription = document.getElementById('taskDescription').value.trim();
  const taskDeadline = document.getElementById('taskDeadline').value;
  const taskPriority = document.getElementById('taskPriority').value;

  if (taskTitle === '' || taskDeadline === '') {
    alert('Please enter a title and deadline for the task.');
    return;
  }

  const categorySelect = document.getElementById('categorySelect');
  const selectedCategory = categorySelect.value;

  const requestData = {
    title: taskTitle,
    description: taskDescription,
    deadline: taskDeadline,
    priority: taskPriority,
    category: selectedCategory
  };

  if (data.editMode && data.editIndex !== null) {
    // Edit existing task
    requestData.id = data.tasks[data.editIndex].id;
  }

  // Use AJAX to send data to saveTask.php
  fetch('saveTask.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      if (data.message) {
        alert(data.message);
        // Clear the input fields
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskDeadline').value = '';
        // Reset edit mode and index
        data.editMode = false;
        data.editIndex = null;
        // Update the UI
        displayCategories();
        displayTasks();
        updateCategorySelect(); // Update category dropdown
      } else if (data.error) {
        alert(data.error);
      } else {
        alert('Unexpected response from the server.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to delete a task
function deleteTask(index, title) {
  const deletedTaskId = index;
  alert('Apakah anda ingi menghapus tugas "' + title+ '" ?');
  // Fetch API untuk mengirim permintaan ke deleteTask.php
  fetch('deleteTask.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskId: deletedTaskId }),
  })
    .then(response => response.json())
    .then(result => {
      if (result.message) {
        // Jika task dihapus berhasil, update data dan UI
        if (data.editMode && index === data.editIndex) {
          // If in edit mode and deleting the edited task, cancel the edit
          data.editMode = false;
          data.editIndex = null;
        } else {
          // If not in edit mode or deleting a different task, proceed with deletion
          data.tasks.splice(index, 1);
        }

        displayTasks();
        updateCategorySelect(); // Update category dropdown
      } else {
        // Jika terjadi kesalahan, tampilkan pesan kesalahan
        console.error(result.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// Function to sort tasks alphabetically by title
function sortTasksAlphabetically() {
  data.tasks.sort((a, b) => a.title.localeCompare(b.title));
  
  // Update the UI after sorting
  displayTasks();
}
function searchTasks() {
  const searchInput = document.getElementById('taskSearch').value.trim().toLowerCase();
  

  const matchingTasks = data.dataTask.filter(task =>
    task.title.toLowerCase().includes(searchInput) ||
    task.description.toLowerCase().includes(searchInput) ||
    task.category.toLowerCase().includes(searchInput)
  );

  if (matchingTasks.length > 0) {
    // Display matching tasks
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-bordered';

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Title</th><th>Description</th><th>Deadline</th><th>Priority</th><th>Category</th><th>Action</th>';
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');
    matchingTasks.forEach((task, index, title) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.deadline}</td>
        <td>${task.priority}</td>
        <td>${task.category}</td>
        <td>
          <button class="btn btn-danger mr-2" onclick="deleteTask(${task.id},'${task.title}')">Delete</button>
          <button class="btn btn-primary" onclick="editTask(${task.id})">Edit</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tasksContainer.appendChild(table);
  } else {
    alert('No matching tasks found.');
  }
}
// Update the UI
displayTasks();
updateCategorySelect();
