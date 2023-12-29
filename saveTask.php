<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"));

$taskTitle = $data->title;
$taskDescription = $data->description;
$taskDeadline = $data->deadline;
$taskPriority = $data->priority;
$taskCategory = $data->category;
$sql = "SELECT id FROM categories WHERE name = '$taskCategory'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $category_id = $row['id'];
    }
} 
if (!$data->editMode) {
    // Add new task to the database
    $sqlInsert = "INSERT INTO tasks (title, description, deadline, priority, category_id) 
                  VALUES ('$taskTitle', '$taskDescription', '$taskDeadline', '$taskPriority', '$category_id')";

    if ($conn->query($sqlInsert) === TRUE) {
        $response = array('message' => 'Task added successfully');
        echo json_encode($response);
    } else {
        $response = array('error' => 'Error adding task: ' . $conn->error);
        echo json_encode($response);
    }
} else {
    // Update existing task in the database
    $taskId = $data->taskId;

    $sqlUpdate = "UPDATE tasks 
                  SET title = '$taskTitle', 
                      description = '$taskDescription', 
                      deadline = '$taskDeadline', 
                      priority = '$taskPriority', 
                      category_id = '$category_id' 
                  WHERE id = $taskId";

    if ($conn->query($sqlUpdate) === TRUE) {
        $response = array('message' => 'Task updated successfully');
        echo json_encode($response);
    } else {
        $response = array('error' => 'Error updating task: ' . $conn->error);
        echo json_encode($response);
    }
}

$conn->close();
?>
