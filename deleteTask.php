<?php
// deleteTask.php
include "config.php";

// Ambil data dari body POST request
$data = json_decode(file_get_contents("php://input"));

// Ambil task ID dari data POST
$taskId = $data->taskId;

// Periksa apakah task dengan ID yang diberikan ada dalam database
$sqlCheckExistence = "SELECT * FROM tasks WHERE id = $taskId";
$resultCheckExistence = $conn->query($sqlCheckExistence);

if ($resultCheckExistence->num_rows > 0) {
    // Task ditemukan, lakukan penghapusan
    $sqlDelete = "DELETE FROM tasks WHERE id = $taskId";

    if ($conn->query($sqlDelete) === TRUE) {
        $response = array('message' => 'Task deleted successfully');
        echo json_encode($response);
    } else {
        $response = array('error' => 'Error deleting task: ' . $conn->error);
        echo json_encode($response);
    }
} else {
    // Task tidak ditemukan, kirim respons error
    $response = array('error' => 'Task not found');
    echo json_encode($response);
}

$conn->close();
?>
