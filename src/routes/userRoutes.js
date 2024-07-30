import express from 'express'
import multer from 'multer'
import {
    register,
    login,
    getUserByIdController,
    editUserController,
} from '../controllers/users/index.js'
import { validateAuth } from '../middlewares/index.js'
import { storage, bufferStorage, limits, fileFilter } from '../utils/index.js'
import {
    resetPassController,
    sendRestoredPass,
} from '../controllers/pass/index.js'

const router = express.Router()

//Módulo para validar y gestionar subida de archivos:
const upload = multer({ storage: storage, limits, fileFilter })
const saveInBuffer = multer({
    storage: bufferStorage,
    limits,
    fileFilter,
})
// Endpoint para registrar un nuevo usuario
router.post('/register', saveInBuffer.single('avatar'), register)

// Endpoint para iniciar sesión
router.post('/login', login)

//Endpoint para obtener la información del usuario registrado:
router.get('/user-info', validateAuth, getUserByIdController)

//Rutas para recuperar la contraseña:
router.post('/request-password-reset', resetPassController)
router.post('/reset-password', sendRestoredPass)

router.patch(
    '/edit-user',
    validateAuth,
    saveInBuffer.single('avatar'),
    editUserController
)

export default router
