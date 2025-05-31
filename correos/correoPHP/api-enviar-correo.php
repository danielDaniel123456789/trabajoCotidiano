<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    $correoUsuario = $_POST['correo'] ?? '';
    $mensajeUsuario = $_POST['mensaje'] ?? '';

    // Configurar servidor SMTP
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

    // Contenido del mensaje
    $mail->isHTML(true);
    $mail->Subject = 'Nuevo mensaje desde formulario web';
    $mail->Body    = "<b>Correo del usuario:</b> {$correoUsuario}<br><b>Mensaje:</b><br>{$mensajeUsuario}";
    $mail->AltBody = "Correo del usuario: {$correoUsuario}\n\nMensaje:\n{$mensajeUsuario}";

    $mail->send();
    echo 'Correo enviado exitosamente';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
