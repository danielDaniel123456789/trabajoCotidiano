<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Asegúrate de que esta ruta esté bien

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destino = $_POST['correo'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    if (filter_var($destino, FILTER_VALIDATE_EMAIL) && !empty($mensaje)) {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = 'server359.web-hosting.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'asistencia@facturahacienda.com';
            $mail->Password   = 'JJD-UQLKK(Vn';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;

            $mail->setFrom('asistencia@facturahacienda.com', 'Formulario Web');
            $mail->addAddress($destino);

            $mail->isHTML(true);
            $mail->Subject = 'Mensaje desde formulario web';
            $mail->Body    = "<b>Mensaje:</b><br>" . nl2br(htmlspecialchars($mensaje));
            $mail->AltBody = strip_tags($mensaje);

            $mail->send();
            echo 'Correo enviado exitosamente.';
        } catch (Exception $e) {
            echo "Error al enviar el correo: {$mail->ErrorInfo}";
        }
    } else {
        echo "Correo inválido o mensaje vacío.";
    }
} else {
    echo "Solicitud inválida.";
}
