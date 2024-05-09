import express from 'express';
import { register, login } from '../controllers/users/index.js';

const router = express.Router();

// Endpoint para registrar un nuevo usuario
router.post('/register', register);

// Endpoint para iniciar sesión
router.post('/login', login);

export default router;
