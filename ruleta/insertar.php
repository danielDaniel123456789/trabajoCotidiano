<?php
$host = "localhost"; // Porque estás usando cPanel
$dbname = "factunjb_asistencia";
$username = "factunjb_daniel";
$password = "(=0OTaL?9+{H";

// Conexión a la base de datos
$conn = new mysqli($host, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Nombre que deseas insertar (puedes cambiarlo por una variable de formulario)
$nombre = "Daniel Prueba";

// Consulta segura
$sql = "INSERT INTO asistencia (nombre) VALUES (?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombre);

if ($stmt->execute()) {
    echo "✅ Dato insertado correctamente.";
} else {
    echo "❌ Error al insertar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
