import { generateError } from '../../utils/index.js';
import {
  checkQuestionNumber,
  createQuestions,
} from '../../models/quiz/index.js';
import { validationSchemaQuestions } from '../../utils/index.js';

const createQuizController = async (req, res, next) => {
  try {
    const result = await checkQuestionNumber(
      req.body.quiz_id,
      req.body.question_number
    );

    if (result) {
      generateError('Ya existe una pregunta con ese número en este quiz', 400);
    }
    //Validación con Joi:
    const { error } = validationSchemaQuestions.validate(req.body);
    if (error) {
      error.message = error.details[0].message;
      throw error;
    }

    await createQuestions(req.body);

    res.send({
      status: 'ok',
      message: 'Has creado un quiz!👌',
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
};

export default createQuizController;
