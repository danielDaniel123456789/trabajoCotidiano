<?php
// Asegúrate de que esta ruta sea correcta respecto a la ubicación de tu script
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'facturahacienda.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'asistencia@facturahacienda.com';
    $mail->Password   = 'JJD-UQLKK(Vn';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Remitente y destinatario
    $mail->setFrom('asistencia@facturahacienda.com', 'Sistema de Correos');
    $mail->addAddress('danielsrbu@gmail.com', 'Daniel Sánchez');

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Prueba desde servidor';
    $mail->Body    = '<h1>Correo de prueba</h1><p>Funcionando desde el servidor</p>';
    $mail->AltBody = 'Correo de prueba (versión texto plano)';

    $mail->send();
    echo 'Correo enviado exitosamente';
} catch (Exception $e) {
    echo "Error al enviar: " . htmlspecialchars($e->getMessage());
}