import { updateQuestionData } from '../../redisOperations/redisFunctions/index.js';
import { handleSocketErrors } from '../../utils/index.js';

const updateQuestionDataHandler = (socket, io) => {
  try {
    socket.on('updateQuestionData', async (quizId, questionData) => {
      // Actualizo datos de la pregunta en Redis:
      await updateQuestionData(questionData, quizId);
    });
  } catch (error) {
    handleSocketErrors(error, socket);
  }
};
export default updateQuestionDataHandler;