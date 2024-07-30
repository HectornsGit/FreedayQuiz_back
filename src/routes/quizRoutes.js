import express from 'express'
const routes = express.Router()
import { validateAuth, joinQuizLimiter } from '../middlewares/index.js'
import {
    createQuizController,
    createQuestionsController,
    getQuizController,
    updateQuizController,
    updateQuestionController,
    getQuizIdByAccessCodeController,
    deleteQuizController,
    deleteQuestionController,
} from '../controllers/quiz/index.js'
import multer from 'multer'
import {
    limits,
    fileFilter,
    storage,
    bufferStorage,
} from '../utils/multerConfig.js'

//Crear quiz:
routes.post('/create-quiz', validateAuth, createQuizController)

//Crear preguntas:
const upload = multer({ storage: storage, limits, fileFilter })
const saveInBuffer = multer({
    storage: bufferStorage,
    limits,
    fileFilter,
})
routes.post(
    '/create-questions',
    validateAuth,
    saveInBuffer.single('image'),
    createQuestionsController
)

//Obtener quiz:
routes.get('/get-quiz/:id', validateAuth, getQuizController)
export default routes

// Editar quiz:
routes.patch('/update-quiz/:id', validateAuth, updateQuizController)

// Editar question:
routes.patch(
    '/update-question/:quiz_id/:question_number',
    validateAuth,
    saveInBuffer.single('image'),
    updateQuestionController
)

//Validar accessCode y traer quizId:
routes.get(
    '/join-quiz/:access_code',
    joinQuizLimiter,
    getQuizIdByAccessCodeController
)

//Borrar quiz:
routes.delete('/delete-quiz/:id', validateAuth, deleteQuizController)

//Borrar pregunta:
routes.delete('/delete-question', validateAuth, deleteQuestionController)
