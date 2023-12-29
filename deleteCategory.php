<?php
use Psy\Readline\Hoa\Console;
include 'config.php';
// Retrieve data sent from JavaScript
$data = json_decode(file_get_contents("php://input"));

$deletedCategory = $data->category;

// Delete the category from the database (replace with your actual SQL query)
$sql = "DELETE FROM categories WHERE name = '$deletedCategory'";

if ($conn->query($sql) === TRUE) {
    $response = ["message" => "Category deleted successfully"];
} else {
    $response = ["error" => "Error: " . $sql . "<br>" . $conn->error];
}

$conn->close();

echo json_encode($response);
?>
