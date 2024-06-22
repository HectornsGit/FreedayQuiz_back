import {
  saveInitialPlayerData,
  getAllQuestions,
} from '../../redisOperations/redisFunctions/index.js';
import { handleSocketErrors } from '../../utils/index.js';

const joinQuizHandler = (socket, io) => {
  socket.on('joinQuiz', async (playerId, quizId, initialPlayerData) => {
    try {
      await saveInitialPlayerData(playerId, quizId, initialPlayerData);

      //Conectarse a la sala del quiz y emitir el evento enviando la data:
      socket.join(quizId);
      io.to(quizId).emit('playerJoined', initialPlayerData);
    } catch (error) {
      handleSocketErrors(error, socket);
    }
  });
};
export default joinQuizHandler;
