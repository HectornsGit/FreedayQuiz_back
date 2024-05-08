import express from "express";
import pool from "./db/getPool.js";
import useDb from "./db/useDb.js";

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

        // Insertar el nuevo usuario en la base de datos
        await pool.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, password]
        );

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;
