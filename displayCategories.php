<?php
include 'config.php';

// Query untuk mengambil data kategori dari tabel 'categories'
$sql = "SELECT * FROM categories";
$result = $conn->query($sql);

// Array untuk menyimpan hasil query
$categories = array();

// Memeriksa apakah query berhasil dijalankan
if ($result) {
    // Mengambil data kategori dan menambahkannya ke array
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['name'];
    }

    // Jika ada kategori, kirim data dalam format JSON
    if (!empty($categories)) {
        echo json_encode($categories);
    } else {
        echo json_encode(array("message" => "No categories available."));
    }
} else {
    // Jika query gagal, kirim pesan error dalam format JSON
    echo json_encode(array("error" => "Error retrieving categories: " . $conn->error));
}

// Menutup koneksi ke database
$conn->close();
?>
