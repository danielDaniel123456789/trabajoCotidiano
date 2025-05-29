<?php
// enviarCorreo.php - Versión segura

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Configuración (deberías mover esto a variables de entorno)
define('SMTP_USER', 'asistencia@facturahacienda.com');
define('SMTP_PASS', 'JJD-UQLKK(Vn'); // MUEVE ESTO A UN LUGAR SEGURO

$mail = new PHPMailer(true);

try {
    // Configuración SMTP
    $mail->isSMTP();
    $mail->Host       = 'facturahacienda.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Remitente y destinatario
    $mail->setFrom(SMTP_USER, 'Sistema de Asistencia');
    $mail->addAddress('danielsrbu@gmail.com', 'Daniel Sánchez');

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = 'Prueba de correo electrónico';
    $mail->Body    = '<h1>Este es un mensaje de prueba</h1><p>Enviado desde el sistema.</p>';
    $mail->AltBody = 'Este es un mensaje de prueba (versión texto)';

    // Envío
    $mail->send();
    echo 'Correo enviado correctamente';
} catch (Exception $e) {
    error_log('Error al enviar correo: ' . $e->getMessage());
    echo 'Error al enviar el mensaje. Por favor intenta más tarde.';
    // En producción, no muestres $mail->ErrorInfo al usuario
}