import express from 'express';
const routes = express.Router();
import { validateAuth } from '../middlewares/index.js';
import {
  createQuizController,
  createQuestionsController,
  getQuizController,
} from '../controllers/quiz/index.js';
import multer from 'multer';
import { limits, fileFilter, storage } from '../utils/multerConfig.js';

//Crear quiz:
routes.post('/create-quiz', validateAuth, createQuizController);

//Crear preguntas:
const upload = multer({ storage: storage, limits, fileFilter });
routes.post(
  '/create-questions',
  validateAuth,
  upload.single('image'),
  createQuestionsController
);

//Obtener quiz:
routes.get('/get-quiz/:title', validateAuth, getQuizController);
export default routes;
