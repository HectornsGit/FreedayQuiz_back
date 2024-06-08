import { getQuiz } from '../../models/quiz/index.js';
import { validationSchemaQuiz } from '../../utils/index.js';
import { updateQuiz } from '../../models/quiz/index.js';

const updateQuizController = async (req, res, next) => {
  try {
    const loggedUserId = req.auth.id;

    const quizFromDb = await getQuiz(loggedUserId, req.params.id);
    console.log('Antes', quizFromDb);
    const quizToUpdate = {
      ...{
        title: quizFromDb.title,
        description: quizFromDb.description,
        ownerId: loggedUserId,
        id: req.params.id,
      },
      ...req.body,
    };

    const { title, description } = quizToUpdate;

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

    await updateQuiz(quizToUpdate);
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
