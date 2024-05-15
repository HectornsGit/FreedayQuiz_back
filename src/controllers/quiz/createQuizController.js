import Joi from 'joi';
import { createQuiz } from '../../models/quiz/index.js';
import { validationSchemaQuiz } from '../../utils/index.js';

const createQuizController = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    //Validación con Joi:
    const { error } = Joi.object(validationSchemaQuiz).validate(req.body);
    if (error) {
      error.message = error.details[0].message;
      throw error;
    }
    //----------------------------
    const insertId = await createQuiz(title, description);

    res.send({
      status: 'ok',
      message: 'Has creado un quiz!👌',
      data: { insertId, title, description },
    });
  } catch (error) {
    next(error);
  }
};

export default createQuizController;
