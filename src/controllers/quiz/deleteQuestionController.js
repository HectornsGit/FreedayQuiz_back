import { deleteQuestion } from '../../models/quiz/index.js';

const deleteQuestionController = async (req, res, next) => {
  try {
    const questionIds = req.body.questionIds;
    const quizId = req.body.quizId;

    await deleteQuestion(questionIds, quizId);
    res
      .status(200)
      .send(
        `Preguntas con ids ${questionIds.map(
          (q) => q
        )}  eliminadas correctamente`
      );
  } catch (error) {
    console.log('Error al eliminar las preguntas');

    next(error);
  }
};
export default deleteQuestionController;
