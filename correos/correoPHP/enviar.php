<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // o incluye manualmente si no usas Composer

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
   $mail->Host       = 'server359.web-hosting.com';
    $mail->SMTPAuth = true;
     $mail->Username   = 'asistencia@facturahacienda.com';
        $mail->Password   = 'JJD-UQLKK(Vn';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

    // Configuración del correo
  $mail->setFrom('asistencia@facturahacienda.com', 'Formulario Web');
    $mail->addAddress('danielsrbu@gmail.com', 'Nombre Destinatario');

    $mail->isHTML(true);
    $mail->Subject = 'Asunto del correo';
    $mail->Body    = '<b>Hola!</b> Este es un correo enviado con PHPMailer.';
    $mail->AltBody = 'Hola! Este es un correo enviado con PHPMailer.';

    $mail->send();
    echo 'Correo enviado exitosamente';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
