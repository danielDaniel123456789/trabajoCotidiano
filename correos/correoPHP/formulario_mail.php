<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'path/to/PHPMailer/src/Exception.php';
require 'path/to/PHPMailer/src/PHPMailer.php';
require 'path/to/PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'server359.web-hosting.com';  // Servidor SMTP
    $mail->SMTPAuth   = true;
    $mail->Username   = 'asistencia@facturahacienda.com'; // Tu usuario SMTP (email)
    $mail->Password   = 'JJD-UQLKK(Vn';                 // Tu contraseña SMTP
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;    // SSL para puerto 465
    $mail->Port       = 465;

    // Debug para ver la conexión SMTP
    $mail->SMTPDebug  = 2;  // 0 = sin debug, 1 = mensajes cliente, 2 = mensajes cliente + servidor
    $mail->Debugoutput = 'html';

    // Destinatarios
    $mail->setFrom('asistencia@facturahacienda.com', 'Tu Nombre o Empresa');
    $mail->addAddress('destinatario@ejemplo.com', 'Nombre Destinatario'); // Agrega un destinatario

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = 'Prueba de correo desde PHPMailer';
    $mail->Body    = '<b>Este es un correo de prueba enviado con PHPMailer usando SMTP.</b>';
    $mail->AltBody = 'Este es un correo de prueba enviado con PHPMailer usando SMTP.';

    $mail->send();
    echo 'Correo enviado correctamente';
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}


<!-- Formulario HTML -->
<form method="POST" action="">
  <label for="nombre">Nombre:</label><br>
  <input type="text" id="nombre" name="nombre" required><br><br>

  <label for="email">Email:</label><br>
  <input type="email" id="email" name="email" required><br><br>

  <label for="mensaje">Mensaje:</label><br>
  <textarea id="mensaje" name="mensaje" rows="5" required></textarea><br><br>

  <label for="receptor">Correo receptor:</label><br>
  <input type="email" id="receptor" name="receptor" required><br><br>

  <button type="submit">Enviar</button>
</form>
