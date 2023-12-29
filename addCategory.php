<?php
// addCategory.php
include "config.php";
// Ambil data dari body POST request
$data = json_decode(file_get_contents("php://input"));

// Ambil nama kategori dari data POST
$categoryName = $data->name;

// Periksa apakah kategori sudah ada dalam database
$sqlCheckExistence = "SELECT * FROM categories WHERE name = '$categoryName'";
$resultCheckExistence = $conn->query($sqlCheckExistence);

if ($resultCheckExistence->num_rows > 0) {
    // Kategori sudah ada, kirim respons
    $response = array('error' => 'Category already exists');
    echo json_encode($response);
} else {
    // Kategori belum ada, tambahkan ke database
    $sqlInsert = "INSERT INTO categories (name) VALUES ('$categoryName')";

    if ($conn->query($sqlInsert) === TRUE) {
        $response = array('message' => 'Category added successfully');
        echo json_encode($response);
    } else {
        $response = array('error' => 'Error adding category: ' . $conn->error);
        echo json_encode($response);
    }
}

$conn->close();
?>
