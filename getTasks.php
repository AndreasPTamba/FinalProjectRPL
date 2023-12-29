<?php
include "config.php"; // Sesuaikan dengan nama file konfigurasi database Anda

// Query untuk mengambil data tasks dari database
$sql = "SELECT tasks.*, categories.name FROM tasks JOIN categories ON categories.id = tasks.category_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $tasks = array();

    // Loop melalui hasil query dan tambahkan setiap row ke array tasks
    while ($row = $result->fetch_assoc()) {
        $tasks[] = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'deadline' => $row['deadline'],
            'priority' => $row['priority'],
            'category' => $row['name']
        );
    }

    // Mengirim data tasks dalam format JSON ke client
    echo json_encode($tasks);
} else {
    // Jika tidak ada tasks, kirim pesan bahwa tidak ada tasks
    echo json_encode(array('message' => 'No tasks available.'));
}

$conn->close();
?>
