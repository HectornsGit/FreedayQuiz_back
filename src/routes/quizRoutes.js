import express from 'express';
const routes = express.Router();
import { validateAuth } from '../middlewares/index.js';
import {
  createQuizController,
  createQuestionsController,
} from '../controllers/quiz/index.js';

routes.post('/create-quiz', validateAuth, createQuizController);
routes.post('/create-questions', validateAuth, createQuestionsController);
export default routes;
