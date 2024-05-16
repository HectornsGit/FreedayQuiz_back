import { createQuiz } from '../../models/quiz/index.js';
import { validationSchemaQuiz } from '../../utils/index.js';

const createQuizController = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const loggedUserId = req.auth?.id;
    console.log('Consolelog', loggedUserId);
    console.log('Consolelog2', req.auth);

    //Validación con Joi:
    const { error } = validationSchemaQuiz.validate(req.body);
    if (error) {
      error.message = error.details[0].message;
      throw error;
    }
    //----------------------------
    const insertId = await createQuiz(title, description, loggedUserId);

    res.send({
      status: 'ok',
      message: 'Has creado un quiz!👌',
      data: { insertId, title, description, loggedUserId },
    });
  } catch (error) {
    next(error);
  }
};

export default createQuizController;
