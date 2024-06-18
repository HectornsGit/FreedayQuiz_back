import { deleteQuestion } from '../../models/quiz/index.js';

const deleteQuestionController = async (req, res, next) => {
  try {
    await deleteQuestion(req.params.questionId, req.params.quizId);
    res
      .status(200)
      .send(
        `Pregunta con id ${req.params.questionId}  eliminada correctamente`
      );
  } catch (error) {
    console.log('Error al eliminar la pregunta');
    next(error);
  }
};
export default deleteQuestionController;
