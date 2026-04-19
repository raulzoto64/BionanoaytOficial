<?php
$file = 'sql/seed.sql';
$content = file_get_contents($file);
$content = str_replace('INSERT INTO', 'INSERT IGNORE INTO', $content);
// Limpiar doble IGNORE si existía
$content = str_replace('INSERT IGNORE IGNORE INTO', 'INSERT IGNORE INTO', $content);
file_put_content($file, $content);
echo "Seed.sql actualizado correctamente con INSERT IGNORE.";
