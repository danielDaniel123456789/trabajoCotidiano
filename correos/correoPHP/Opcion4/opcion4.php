<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
// Permitir peticiones desde cualquier origen (no recomendado para producción sin control)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destino = $_POST['correo'] ?? '';
    $tabla_html = $_POST['tabla_html'] ?? '';

    if (filter_var($destino, FILTER_VALIDATE_EMAIL) && !empty($tabla_html)) {
        $mail = new PHPMailer(true);

        try {
            // Configuración SMTP
            $mail->isSMTP();
            $mail->Host       = 'server359.web-hosting.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'asistencia@facturahacienda.com';
            $mail->Password   = 'JJD-UQLKK(Vn';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;

            // Remitente y destinatario
            $mail->setFrom('asistencia@facturahacienda.com', 'Formulario Web');
            $mail->addAddress($destino);

            // Contenido del correo en HTML
            $mail->isHTML(true);
            $mail->Subject = 'Tabla enviada desde formulario web';

            $mail->Body = '
                <html>
                <head>
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h3>Tabla enviada desde el formulario:</h3>
                    ' . $tabla_html . '
                </body>
                </html>';

            $mail->AltBody = strip_tags($tabla_html);

            $mail->send();
            echo '✅ Correo enviado exitosamente.';
        } catch (Exception $e) {
            echo "❌ Error al enviar el correo: {$mail->ErrorInfo}";
        }
    } else {
        echo "⚠️ Correo inválido o tabla vacía.";
    }
} else {
    echo "Solicitud no válida.";
}
