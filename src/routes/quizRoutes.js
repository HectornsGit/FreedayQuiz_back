import express from 'express';
const routes = express.Router();
import { createQuizController } from '../controllers/quiz/index.js';

routes.post('/create-quiz', createQuizController);
export default routes;
