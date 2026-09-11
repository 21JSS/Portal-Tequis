require('dotenv').config({path: '.env'});
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_tequisquiapan'
  });

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS chat_sesion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT UNSIGNED NOT NULL,
        estado ENUM('abierto', 'cerrado') DEFAULT 'abierto',
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
        actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
      )
    `);
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS chat_mensaje (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sesion_id INT NOT NULL,
        remitente_tipo ENUM('ciudadano', 'admin') NOT NULL,
        remitente_id INT UNSIGNED NOT NULL,
        mensaje TEXT NOT NULL,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sesion_id) REFERENCES chat_sesion(id) ON DELETE CASCADE,
        FOREIGN KEY (remitente_id) REFERENCES usuario(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Tablas creadas correctamente');
  } catch(e) {
    console.error('Error DB:', e);
  } finally {
    await conn.end();
  }
}
run();
