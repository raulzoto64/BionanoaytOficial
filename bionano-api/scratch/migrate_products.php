<?php
require_once 'db.php';
try {
    $pdo->exec("ALTER TABLE product_translations ADD COLUMN sections JSON AFTER meta_description");
    echo "Column 'sections' added successfully to 'product_translations'.";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column 'sections' already exists.";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
?>
