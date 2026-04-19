<?php
/**
 * ARCHIVO: db.php
 * Clase de conexión robusta para HostGator
 */

class Conexion {
    private $servidor = "localhost";
    private $db = "tatian32_bionano";
    private $usuario = "tatian32_denis";
    private $contrasena = "e=)btz]i";
    private $charset = "utf8mb4";
    public $pdo = null;

    // Configuración corregida (sin guiones bajos extras)
    private $atributos = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    public function __construct() {
        try {
            $dsn = "mysql:host={$this->servidor};dbname={$this->db};charset={$this->charset}";
            $this->pdo = new PDO($dsn, $this->usuario, $this->contrasena, $this->atributos);
        } catch (PDOException $e) {
            header('Content-Type: application/json', true, 500);
            echo json_encode([
                "error" => "Error de conexión",
                "message" => $e->getMessage()
            ]);
            exit;
        }
    }
}

// Inicializar la conexión para que esté disponible en los controladores
$db_obj = new Conexion();
$pdo = $db_obj->pdo;
