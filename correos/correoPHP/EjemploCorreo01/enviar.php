<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Asegúrate que esta ruta es correcta

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'server359.web-hosting.com'; // Host correcto
    $mail->SMTPAuth   = true;
    $mail->Username   = 'asistencia@facturahacienda.com'; // Usuario SMTP
    $mail->Password   = 'JJD-UQLKK(Vn'; // ⚠️ Revisa que esta contraseña sea actual y válida
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Usa 'ssl'
    $mail->Port       = 465; // Puerto SSL

    // Remitente y destinatario
    $mail->setFrom('asistencia@facturahacienda.com', 'Formulario Web');
    $mail->addAddress('danielsrbu@gmail.com', 'Nombre Destinatario');

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Asunto del correo';
    $mail->Body    = '<b>Hola!</b> Este es un correo enviado con PHPMailer.';
    $mail->AltBody = 'Hola! Este es un correo enviado con PHPMailer.';

    $mail->send();
    echo 'Correo enviado exitosamente';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
