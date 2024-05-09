import pool from './getPool.js';
import useDb from './useDb.js';

const createDb = async () => {
  try {
    await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.NAME_DB};`);

    await useDb();

    await pool.query('SET FOREIGN_KEY_CHECKS = 0;');

    await pool.query(`DROP TABLE IF EXISTS users;`);

    await pool.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(64)NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(64) NOT NULL,
                avatar VARCHAR(255),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
            );`);

    await pool.query(`DROP TABLE IF EXISTS quizzes;`);

    await pool.query(`
            CREATE TABLE quizzes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(40) NOT NULL,
                description TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
            );`);

    await pool.query(`DROP TABLE IF EXISTS questions;`);

    await pool.query(`
            CREATE TABLE questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                quiz_id INT NOT NULL,
                title VARCHAR(60) NOT NULL,
                optionA VARCHAR(60) NOT NULL,
                optionB VARCHAR(60),
                optionC VARCHAR(60),
                optionD VARCHAR(60),
                question_number INT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
            );`);

    await pool.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('Tablas de base de datos creada exitosamente');
  } catch (error) {
    throw error;
  }
};

createDb();
