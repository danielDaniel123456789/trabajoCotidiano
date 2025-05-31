<?php
// api/enviar-correo.php
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php'; // Ajusta esta ruta si es necesario

// Validar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

// Obtener datos del cuerpo JSON
$datos = json_decode(file_get_contents('php://input'), true);

$correo = $datos['correo'] ?? '';
$mensaje = $datos['mensaje'] ?? '';

if (empty($correo) || empty($mensaje)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos obligatorios']);
    exit;
}

$mail = new PHPMailer(true);

try {
    // Configuración SMTP
    $mail->isSMTP();
    $mail->Host       = 'server359.web-hosting.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'asistencia@facturahacienda.com';
    $mail->Password   = 'JJD-UQLKK(Vn';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Remitente y destinatario fijo
    $mail->setFrom('asistencia@facturahacienda.com', 'Formulario Web');
    $mail->addAddress('danielsrbu@gmail.com', 'Daniel');

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = 'Mensaje desde formulario web';
    $mail->Body    = "<strong>Correo del usuario:</strong> $correo<br><strong>Mensaje:</strong><br>$mensaje";
    $mail->AltBody = "Correo del usuario: $correo\n\nMensaje:\n$mensaje";

    $mail->send();
    echo json_encode(['status' => 'ok', 'message' => 'Correo enviado exitosamente']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => "Error: {$mail->ErrorInfo}"]);
}
