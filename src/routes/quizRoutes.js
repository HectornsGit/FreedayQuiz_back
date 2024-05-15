import express from 'express';
const routes = express.Router();
import {
  createQuizController,
  createQuestionsController,
} from '../controllers/quiz/index.js';

routes.post('/create-quiz', createQuizController);
routes.post('/create-questions', createQuestionsController);
export default routes;
