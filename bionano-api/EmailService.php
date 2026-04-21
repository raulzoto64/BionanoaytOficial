<?php
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    

private function configurarMailer() {
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'sergiohoraciocepeda88@gmail.com';
        $mail->Password   = 'qzja vtas pzvf eyjd';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';

        // ✅ Corregido: El remitente debe coincidir con la cuenta SMTP
        $mail->setFrom('sergiohoraciocepeda88@gmail.com', 'Bionano A&T');

        return $mail;
    }

    public function mandarCorreoSolicitud($email_destino, $nombre_solicitante, $id_solicitante) {
        try {
            $mail = $this->configurarMailer();
            $mail->addAddress($email_destino);

            $url_perfil = "https://hitpoly.com/perfil/" . $id_solicitante;
            $mail->isHTML(true);
            $mail->Subject = 'Tienes una nueva solicitud de conexión en Hitpoly';
            
            $mail->Body = "
                <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 600px; margin: 0 auto;'>
                    <div style='text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;'>
                        <h2 style='color: #1877f2; margin: 0;'>Hitpoly</h2>
                    </div>
                    <div style='padding: 30px 20px;'>
                        <h2 style='color: #333;'>¡Hola!</h2>
                        <p style='color: #555; font-size: 16px; line-height: 1.6;'>
                            <strong style='color: #1877f2;'>$nombre_solicitante</strong> te ha enviado una solicitud de conexión.
                        </p>
                        <div style='margin-top: 30px; text-align: center;'>
                            <a href='$url_perfil' style='background-color: #1877f2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;'>
                                Ver Perfil
                            </a>
                        </div>
                    </div>
                    <div style='text-align: center; padding: 20px; color: #999; font-size: 13px; border-top: 1px solid #eee;'>
                        Este correo fue enviado automáticamente, por favor no respondas.
                    </div>
                </div>";

            $mail->send();
            return ['status' => 'success'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $mail->ErrorInfo];
        }
    }

    public function enviarCodigoVerificacion($email_destino, $codigo_verificacion, $nombre_usuario = '') {
        try {
            $mail = $this->configurarMailer();
            $mail->addAddress($email_destino);

            $mail->isHTML(true);
            $mail->Subject = 'Código de verificación - Hitpoly';
            
            $saludo = $nombre_usuario ? "¡Hola $nombre_usuario!" : "¡Hola!";
            
            $mail->Body = "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;'>
                    <div style='background: linear-gradient(135deg, #1877f2 0%, #0d47a1 100%); padding: 30px; text-align: center;'>
                        <h1 style='color: white; margin: 0; font-size: 24px;'>Hitpoly</h1>
                        <p style='color: rgba(255,255,255,0.9); margin: 10px 0 0 0;'>Verificación de cuenta</p>
                    </div>
                    
                    <div style='padding: 40px 30px; background: #ffffff;'>
                        <h2 style='color: #333; margin: 0 0 20px 0;'>$saludo</h2>
                        
                        <p style='color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;'>
                            Gracias por registrarte en Hitpoly. Utiliza el siguiente código para verificar tu dirección de correo electrónico:
                        </p>
                        
                        <div style='background: #f8f9fa; border: 2px dashed #1877f2; border-radius: 10px; padding: 25px; text-align: center; margin: 20px 0;'>
                            <div style='font-size: 48px; font-weight: bold; color: #1877f2; letter-spacing: 12px; font-family: monospace;'>
                                $codigo_verificacion
                            </div>
                        </div>
                        
                        <div style='margin-top: 30px; text-align: center;'>
<a href='http://localhost:5173/verificar-codigo?email=$email_destino' style='background-color: #1877f2; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;'>
                                Verificar mi correo electrónico
                            </a>
                        </div>
                        
                        <p style='color: #666; font-size: 15px; margin-top: 25px; text-align: center;'>
                            O copia y pega este código directamente en la página de verificación
                        </p>
                        
                        <p style='color: #777; font-size: 14px; line-height: 1.5; text-align: center; margin-top: 20px;'>
                            Este código expirará en <strong>15 minutos</strong>.<br>
                            Si no solicitaste este código, puedes ignorar este mensaje.
                        </p>
                    </div>
                    
                    <div style='background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 13px;'>
                        © 2026 Hitpoly. Todos los derechos reservados.
                    </div>
                </div>";

            $mail->send();
            return ['status' => 'success'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $mail->ErrorInfo];
        }
    }
}
?>