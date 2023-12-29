<?php
// editTask.php
include 'config.php';

// Get the JSON data sent from the client
$data = json_decode(file_get_contents("php://input"));

// Check if the data is valid
if (isset($data->id, $data->title, $data->description, $data->deadline, $data->priority, $data->category)) {
    // Extract data
    $taskId = $data->id;
    $taskTitle = $data->title;
    $taskDescription = $data->description;
    $taskDeadline = $data->deadline;
    $taskPriority = $data->priority;
    $taskCategory = $data->category;

    // Assuming your table is named 'tasks'
    $query = "UPDATE tasks 
              SET title = '$taskTitle', 
                  description = '$taskDescription', 
                  deadline = '$taskDeadline', 
                  priority = '$taskPriority', 
                  category = '$taskCategory' 
              WHERE id = $taskId";

    // Execute the query
    if (mysqli_query($your_db_connection, $query)) {
        $response = ['message' => 'Task updated successfully'];
    } else {
        $response = ['error' => 'Error updating task: ' . mysqli_error($your_db_connection)];
    }
} else {
    $response = ['error' => 'Invalid data received'];
}

// Send the JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>