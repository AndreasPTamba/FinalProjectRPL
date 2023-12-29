<?php
include "config.php";

// Query untuk mengambil data kategori
$sql = "SELECT name FROM categories";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $categories = array();
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['name'];
    }

    // Mengirim data kategori sebagai respons JSON
    echo json_encode($categories);
} else {
    // Mengirim respons kosong jika tidak ada kategori
    echo json_encode(array());
}

$conn->close();
?>
