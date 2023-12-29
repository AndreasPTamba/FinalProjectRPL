<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RemindMe</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="logo">
            <img src="logo.png" alt="Logo">
            <span>RemindMe</span>
        </div>
    </header>

    <div class="container mt-5">
        <h1 class="mb-4">Managing Your Task Here!</h1>

        <!-- Category Form -->
        <div class="category mb-3">
            <label for="categoryInput">New Category:</label>
            <div class="input-group">
                <input type="text" class="form-control" id="categoryInput" placeholder="Enter category">
                <div class="input-group-append">
                    <button class="btn btn-primary" onclick="addCategory()">Add Category</button>
                </div>
            </div>
        </div>

        <!-- Task Form -->
        <div class="task mb-3">
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

            <select class="form-control mb-2" id="categorySelect"></select>
            <button class="btn btn-success" onclick="addTask()">Add Task</button>
        </div>

        <!-- Display Categories as a list -->
        <div class="categories mt-5">
            <h2 class="mb-4">Categories</h2>
            <div id="categories"></div>
        </div>
    </div>
</div>
    <!-- New container for displaying tasks -->
    <div class="container mt-5">
    <div class="task-search mb-3">
    <label for="taskSearch">Search Tasks:</label>
    <div class="input-group">
        <input type="text" class="form-control" id="taskSearch" placeholder="Enter search term">
        <div class="input-group-append">
            <button class="btn btn-primary" onclick="searchTasks()">Search</button>
        </div>
    </div>
        <div class="task-display-container mt-5">
            <h2 class="mb-4">Tasks</h2>
            <button class="btn btn-secondary mb-3" onclick="sortTasksAlphabetically()">Sort A-Z</button>
            <div id="tasks"></div>
        </div>
    </div>

    <footer>
        <div class="footer-content">
            <p>&copy; 2023 RemindMe. All rights reserved.</p>
        </div>
    </footer>
    <script src="script.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
  displayCategories();
});
    </script>
</body>
</html>
