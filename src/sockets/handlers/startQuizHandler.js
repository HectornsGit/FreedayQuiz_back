import { getQuestionByQuestionNumber } from '../../redisOperations/redisFunctions/index.js';
import { handleSocketErrors } from '../../utils/index.js';

const startQuizHandler = (socket, io) => {
  socket.on('startQuiz', async (quizId) => {
    try {
      const firstQuestionNumber = 1;
      const firstQuestion = await getQuestionByQuestionNumber(
        quizId,
        firstQuestionNumber
      );

      //Emitir la primera pregunta a la sala correspondiente
      io.to(quizId).emit('question', firstQuestion);
    } catch (error) {
      handleSocketErrors(error, socket);
    }
  });
};
export default startQuizHandler;
