import express from "express";
import pool from "./db/getPool.js";
import useDb from "./db/useDb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Endpoint para registrar un nuevo usuario
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Seleccionar la base de datos
        await useDb();

        // Verificar si el correo electrónico ya está en uso
        const [existingUser] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res
                .status(400)
                .json({ message: "El correo electrónico ya está registrado" });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        await pool.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Endpoint para iniciar sesión
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Seleccionar la base de datos
        await useDb();

        // Verificar si el usuario existe en la base de datos
        const [existingUser] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Verificar la contraseña
        const match = await bcrypt.compare(password, existingUser[0].password);
        if (!match) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Generar un token de acceso
        const token = jwt.sign(
            { userId: existingUser[0].id, email: existingUser[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // El token expirará en 1 hora
        );


        res.status(200).json({ token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;