import { updateQuizData } from '../../redisOperations/redisFunctions/index.js';
import { handleSocketErrors } from '../../utils/index.js';

const updateQuizDataHandler = (socket, io) => {
  try {
    socket.on('updateQuizData', async (_quizId, quizData) => {
      //Actualizo datos del quiz en Redis:
      await updateQuizData(quizData);
    });
  } catch (error) {
    handleSocketErrors(error, socket);
  }
};
export default updateQuizDataHandler;
