import pool from './getPool.js'
import useDb from './useDb.js'

const createDb = async () => {
    try {
        await pool.query(
            `CREATE DATABASE IF NOT EXISTS ${process.env.NAME_DB};`
        )

        await useDb()

        await pool.query('SET FOREIGN_KEY_CHECKS = 0;')

        await pool.query(`DROP TABLE IF EXISTS users;`)

        await pool.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(64)NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(64) NOT NULL,
                avatar VARCHAR(255),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
            );`)

        await pool.query(`DROP TABLE IF EXISTS quizzes;`)

        await pool.query(`
            CREATE TABLE quizzes (
                id CHAR(36) PRIMARY KEY,
                title VARCHAR(40) NOT NULL,
                description TEXT,
                owner_id INT NOT NULL,
                access_code VARCHAR(10) UNIQUE NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id)
            );`)

        await pool.query(`DROP TABLE IF EXISTS questions;`)

        await pool.query(`
            CREATE TABLE questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                quiz_id CHAR(36) NOT NULL,
                question VARCHAR(60) NOT NULL,
                question_time INT NOT NULL,
                optionA VARCHAR(60) NOT NULL,
                optionB VARCHAR(60),
                optionC VARCHAR(60),
                correctAnswer VARCHAR(60),
                question_number INT NOT NULL,
                image VARCHAR(255),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
            );`)

        // Esto es un trigger para generar UUID en los ids de la tabla quizzes
        await pool.query(`DROP TRIGGER IF EXISTS before_insert_quizzes;`)
        await pool.query(`
            CREATE TRIGGER before_insert_quizzes
            BEFORE INSERT ON quizzes
            FOR EACH ROW
            BEGIN
                SET NEW.id = UUID();
            END;
        `)

        await pool.query('SET FOREIGN_KEY_CHECKS = 1;')

        console.log('Tablas de base de datos creada exitosamente')
    } catch (error) {
        throw error
    }
}

createDb()
