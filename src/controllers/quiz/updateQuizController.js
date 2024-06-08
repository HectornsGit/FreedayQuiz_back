import path from 'path';
import fs from 'fs/promises';
import { getQuiz } from '../../models/quiz/index.js';
import { updateQuizAndQuestions } from '../../models/quiz/index.js';
import { validationSchemaQuiz } from '../../utils/index.js';
import { validationSchemaQuestions } from '../../utils/index.js';

const updateQuizController = async (req, res, next) => {
  try {
    const loggedUserId = req.auth.id;

    const quizAndQuestions = await getQuiz(loggedUserId, req.params.id);

    const quizToUpdate = {
      ...quizAndQuestions[0],
      ...req.body,
      ...{ ownerId: loggedUserId },
      ...(req.file && { image: req.file.filename }),
    };

    //Si envías una nueva foto, se borra la anterior de la carpeta uploads:
    if (req.file) {
      const oldImagePath = path.join(
        'src',
        'uploads',
        quizAndQuestions[0].image
      );
      const newImagePath = path.join('src', 'uploads', req.file.filename);

      try {
        // Si la imagen actual es diferente a la predeterminada, se elimina la anterior:
        if (
          newImagePath &&
          newImagePath !== oldImagePath &&
          oldImagePath !== 'imagenPredeterminadaQuestions.png'
        ) {
          await fs.unlink(oldImagePath);
        }
      } catch (error) {
        console.error(
          'Error al acceder o eliminar la imagen actual:',
          error.message
        );
      }
    }

    const {
      title,
      description,
      question,
      question_time,
      optionA,
      optionB,
      optionC,
      correctAnswer,
      question_number,
    } = quizToUpdate;

    //Validación con Joi:
    const validationQuizObject = {
      title,
      description,
    };
    const { quizError } = validationSchemaQuiz.validate(validationQuizObject);

    if (quizError) {
      error.message = error.details[0].message;
      throw error;
    }

    const validationQuestionObject = {
      quiz_id: req.params.id,
      question,
      question_time,
      optionA,
      optionB,
      optionC,
      correctAnswer,
      question_number,
    };

    const { QuestionsError } = validationSchemaQuestions.validate(
      validationQuestionObject
    );

    if (QuestionsError) {
      error.message = error.details[0].message;
      throw error;
    }

    await updateQuizAndQuestions(quizToUpdate);
    res.send({
      status: 'Ok',
      data: {
        message: 'Datos actualizados correctamente',
        quizToUpdate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default updateQuizController;
