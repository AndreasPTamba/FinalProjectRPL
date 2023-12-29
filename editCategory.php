<?php
// editCategory.php
include "config.php";

// Ambil data dari body POST request
$data = json_decode(file_get_contents("php://input"));

// Ambil data nama kategori lama dan baru dari data POST
$oldName = $data->oldData;
$newName = $data->name;

// Periksa apakah kategori lama ada dalam database
$sqlCheckExistence = "SELECT * FROM categories WHERE name = '$oldName'";
$resultCheckExistence = $conn->query($sqlCheckExistence);

if ($resultCheckExistence->num_rows > 0) {
    // Kategori lama ditemukan, lakukan update
    $sqlUpdate = "UPDATE categories SET name = '$newName' WHERE name = '$oldName'";

    if ($conn->query($sqlUpdate) === TRUE) {
        // Update berhasil
        $response = array('message' => 'Category updated successfully');
        echo json_encode($response);
    } else {
        // Terjadi kesalahan saat update
        $response = array('error' => 'Error updating category: ' . $conn->error);
        echo json_encode($response);
    }
} else {
    // Kategori lama tidak ditemukan, kirim respons error
    $response = array('error' => 'Category not found');
    echo json_encode($response);
}

$conn->close();
?>