<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destino = $_POST['correo'] ?? '';
    $tablaHTML = $_POST['tabla'] ?? '';

    if (filter_var($destino, FILTER_VALIDATE_EMAIL) && !empty($tablaHTML)) {
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
            $mail->Subject = 'Tabla enviada desde el formulario';
            $mail->Body    = "
                <h3>Tabla enviada:</h3>
                $tablaHTML
            ";

            $mail->send();
            echo "✅ Correo enviado con la tabla.";
        } catch (Exception $e) {
            echo "❌ Error al enviar: {$mail->ErrorInfo}";
        }
    } else {
        echo "⚠️ Correo inválido o tabla vacía.";
    }
} else {
    echo "Solicitud no válida.";
}
