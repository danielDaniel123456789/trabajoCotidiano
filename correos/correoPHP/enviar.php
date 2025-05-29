<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre    = trim($_POST['nombre']);
    $email     = trim($_POST['email']);
    $mensaje   = trim($_POST['mensaje']);
    $receptor  = trim($_POST['receptor']);

    // Validaciones básicas
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Email del remitente no válido.";
        exit;
    }

    if (!filter_var($receptor, FILTER_VALIDATE_EMAIL)) {
        echo "Email del receptor no válido.";
        exit;
    }

    if (empty($nombre) || empty($mensaje)) {
        echo "Todos los campos son obligatorios.";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host       = 'server359.web-hosting.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'asistencia@facturahacienda.com';
        $mail->Password   = 'JJD-UQLKK(Vn';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Debug opcional
        $mail->SMTPDebug  = 0; // Pon 2 para depuración
        $mail->Debugoutput = 'html';

        // Configurar remitente y destinatario
        $mail->setFrom('asistencia@facturahacienda.com', 'Formulario Web');
        $mail->addAddress($receptor, 'Receptor del mensaje');
        $mail->addReplyTo($email, $nombre);

        // Contenido del mensaje
        $mail->isHTML(true);
        $mail->Subject = "Nuevo mensaje de $nombre";
        $mail->Body    = "
            <h3>Nuevo mensaje desde el formulario web</h3>
            <p><strong>Nombre:</strong> $nombre</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Mensaje:</strong><br>$mensaje</p>
        ";
        $mail->AltBody = "Nombre: $nombre\nEmail: $email\nMensaje:\n$mensaje";

        $mail->send();
        echo 'Mensaje enviado correctamente.';
    } catch (Exception $e) {
        echo "Error al enviar el mensaje: {$mail->ErrorInfo}";
    }
} else {
    echo "Acceso denegado.";
}
?>
