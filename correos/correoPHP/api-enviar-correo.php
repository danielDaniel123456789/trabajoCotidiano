<?php
header("Access-Control-Allow-Origin: *"); // O limita a tu dominio
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

// Recibir datos JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos JSON no válidos.']);
    exit;
}

$nombre   = trim($data['nombre'] ?? '');
$email    = trim($data['email'] ?? '');
$mensaje  = trim($data['mensaje'] ?? '');
$receptor = trim($data['receptor'] ?? '');

// Validaciones
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !filter_var($receptor, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Emails no válidos.']);
    exit;
}

if (empty($nombre) || empty($mensaje)) {
    echo json_encode(['success' => false, 'message' => 'Campos requeridos vacíos.']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'server359.web-hosting.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'asistencia@facturahacienda.com';
    $mail->Password   = 'JJD-UQLKK(Vn';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('asistencia@facturahacienda.com', 'API Web');
    $mail->addAddress($receptor);
    $mail->addReplyTo($email, $nombre);

    $mail->isHTML(true);
    $mail->Subject = "Nuevo mensaje de $nombre";
    $mail->Body    = "
        <h3>Nuevo mensaje desde la API</h3>
        <p><strong>Nombre:</strong> $nombre</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Mensaje:</strong><br>$mensaje</p>
    ";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Error: {$mail->ErrorInfo}"]);
}
