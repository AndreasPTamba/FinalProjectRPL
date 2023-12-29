<?php
include "config.php";

// Ambil data dari body POST request
$data = json_decode(file_get_contents("php://input"));

// Fungsi untuk menambah tugas
function addTask($conn, $task) {
    $title = $task->title;
    $description = $task->description;
    $deadline = $task->deadline;
    $priority = $task->priority;
    $category = $task->category;

    $sqlAddTask = "INSERT INTO tasks (title, description, deadline, priority, category) 
                   VALUES ('$title', '$description', '$deadline', '$priority', '$category')";

    if ($conn->query($sqlAddTask) === TRUE) {
        return array('message' => 'Task added successfully');
    } else {
        return array('error' => 'Error adding task: ' . $conn->error);
    }
}

// Fungsi untuk mengedit tugas
function editTask($conn, $task, $oldTitle) {
    $title = $task->title;
    $description = $task->description;
    $deadline = $task->deadline;
    $priority = $task->priority;
    $category = $task->category;

    $sqlEditTask = "UPDATE tasks 
                    SET title = '$title', description = '$description', deadline = '$deadline', 
                        priority = '$priority', category = '$category' 
                    WHERE title = '$oldTitle'";

    if ($conn->query($sqlEditTask) === TRUE) {
        return array('message' => 'Task updated successfully');
    } else {
        return array('error' => 'Error updating task: ' . $conn->error);
    }
}

// Fungsi untuk menghapus tugas
function deleteTask($conn, $title) {
    $sqlDeleteTask = "DELETE FROM tasks WHERE title = '$title'";

    if ($conn->query($sqlDeleteTask) === TRUE) {
        return array('message' => 'Task deleted successfully');
    } else {
        return array('error' => 'Error deleting task: ' . $conn->error);
    }
}

// Menentukan aksi berdasarkan jenis tindakan yang diterima
if ($data->action === 'add') {
    echo json_encode(addTask($conn, $data));
} elseif ($data->action === 'edit') {
    echo json_encode(editTask($conn, $data, $data->oldTitle));
} elseif ($data->action === 'delete') {
    echo json_encode(deleteTask($conn, $data->title));
} else {
    echo json_encode(array('error' => 'Invalid action'));
}

$conn->close();
?>
