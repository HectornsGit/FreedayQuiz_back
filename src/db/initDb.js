import pool from './getPool.js';
import useDb from './useDb.js';

const createDb = async () => {
  try {
    await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.NAME_DB};`);

    await useDb();

    await pool.query(`DROP TABLE IF EXISTS users;`);

    await pool.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(64)NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(64) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
            );`);

    console.log('Tablas de base de datos creada exitosamente');
  } catch (error) {
    throw error;
  }
};

createDb();
