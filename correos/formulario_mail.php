<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require 'PHPMailer/src/Exception.php';
    require 'PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/src/SMTP.php';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'facturahacienda.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'asistencia@facturahacienda.com';
        $mail->Password   = 'T!8(I[kJDO-j7'; 
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;

        $mail->setFrom('asistencia@facturahacienda.com', 'Formulario Web');
        $mail->addAddress($_POST['correo_destino']); // ← correo receptor enviado desde el formulario

        $mail->isHTML(true);
        $mail->Subject = 'Nuevo mensaje del formulario';
        $mail->Body    = "
            <h3>Mensaje desde el formulario</h3>
            <p><strong>Nombre:</strong> {$_POST['nombre']}</p>
            <p><strong>Email:</strong> {$_POST['email']}</p>
            <p><strong>Mensaje:</strong><br>{$_POST['mensaje']}</p>
        ";

        $mail->send();
        echo '<p>Mensaje enviado correctamente.</p>';
    } catch (Exception $e) {
        echo "<p>Error al enviar: {$mail->ErrorInfo}</p>";
    }
}
?>

<!-- Formulario HTML -->
<form method="POST" action="">
  <label>Nombre:</label><br>
  <input type="text" name="nombre" required><br><br>
  
  <label>Tu correo:</label><br>
  <input type="email" name="email" required><br><br>
  
  <label>Correo receptor:</label><br>
  <input type="email" name="correo_destino" required><br><br>
  
  <label>Mensaje:</label><br>
  <textarea name="mensaje" rows="5" required></textarea><br><br>
  
  <button type="submit">Enviar</button>
</form>
