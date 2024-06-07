import express from 'express';
import multer from 'multer';
import {
  register,
  login,
  getUserByIdController,
  editUserController,
} from '../controllers/users/index.js';
import { validateAuth } from '../middlewares/index.js';
import { storage, limits, fileFilter } from '../utils/index.js';

const router = express.Router();

//Módulo para validar y gestionar subida de archivos:
const upload = multer({ storage: storage, limits, fileFilter });
// Endpoint para registrar un nuevo usuario
router.post('/register', upload.single('avatar'), register);

// Endpoint para iniciar sesión
router.post('/login', login);

//Endpoint para obtener la información del usuario registrado:
router.get('/user-info', validateAuth, getUserByIdController);

router.patch(
  '/edit-user',
  validateAuth,
  upload.single('avatar'),
  editUserController
);

export default router;
