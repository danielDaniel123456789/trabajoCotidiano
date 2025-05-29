<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre  = $_POST['nombre'];
    $email   = $_POST['email'];
    $asunto  = $_POST['asunto'];
    $mensaje = $_POST['mensaje'];

    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host       = 'server359.web-hosting.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'asistencia@facturahacienda.com';
        $mail->Password   = 'JJD-UQLKK(Vn';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // O usar STARTTLS si usas puerto 587
        $mail->Port       = 465;

        // Debug opcional
        // $mail->SMTPDebug = 2;
        // $mail->Debugoutput = 'html';

        // Datos del mensaje
        $mail->setFrom('asistencia@facturahacienda.com', 'Formulario Web');
        $mail->addAddress('danielsrbu@tucorreo.com', 'Destino'); // Cambia esto
        $mail->addReplyTo($email, $nombre);

        $mail->isHTML(true);
        $mail->Subject = "Nuevo mensaje de $nombre: $asunto";
        $mail->Body    = "
            <h3>Nuevo mensaje desde el formulario</h3>
            <p><strong>Nombre:</strong> $nombre</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Mensaje:</strong><br>$mensaje</p>
        ";
        $mail->AltBody = "Nombre: $nombre\nEmail: $email\nMensaje: $mensaje";

        $mail->send();
        echo 'Mensaje enviado correctamente.';
    } catch (Exception $e) {
        echo "Error al enviar el mensaje: {$mail->ErrorInfo}";
    }
} else {
    echo "Acceso denegado.";
}
