import express from 'express';
import multer from 'multer';
import { register, login } from '../controllers/users/index.js';
import { storage, limits, fileFilter } from '../utils/index.js';

const router = express.Router();

//Módulo para validar y gestionar subida de archivos:
const upload = multer({ storage: storage, limits, fileFilter });
// Endpoint para registrar un nuevo usuario
router.post('/register', upload.single('avatar'), register);

// Endpoint para iniciar sesión
router.post('/login', login);

export default router;
