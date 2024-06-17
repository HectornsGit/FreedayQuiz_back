import { getQuiz } from '../models/quiz/index.js';
import {
  storeQuizDataInRedis,
  saveInitialPlayerData,
  updatePlayerData,
} from '../redisOperations/redisFunctions/index.js';
import { getQuestionById } from '../redisOperations/redisFunctions/index.js';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    //El jugador pone su nickname y se une al quiz. Sus datos se guardan en Redis
    socket.on('joinQuiz', async (playerId, quizId, initialPlayerData) => {
      try {
        await saveInitialPlayerData(playerId, quizId, initialPlayerData);
      } catch (error) {
        console.error(error.message);
        return;
      }

      //Conectarse a la sala del quiz:
      socket.join(quizId);
      io.to(quizId).emit('playerJoined', initialPlayerData);
    });

    //El master inicia el quiz. Se guardan los datos del quiz en Redis y se envía la primera pregunta al cliente
    socket.on('startQuiz', async (loggedUserId, quizId) => {
      const quiz = await getQuiz(loggedUserId, quizId);
      await storeQuizDataInRedis(quiz);
      const firstQuestion = await getQuestionById(quizId, 1);
      //Emitir la primera pregunta a la sala correspondiente
      io.to(quizId).emit('question', firstQuestion);
    });

    //Se escucha la respuesta del jugador y se compara con la respuesta correcta y se actualizan los datos para enviárselos al front:
    socket.on('submitAnswer', async (data) => {
      const { quizId, questionId, answer, playerId, questionNumber } = data;
      console.log(data);
      const currentQuestion = await getQuestionById(quizId, questionId);
      let playerData = {};
      if (currentQuestion.correctAnswer === answer) {
        console.log('Correcto');
        playerData = await updatePlayerData(quizId, questionId, playerId, 1);
      } else {
        console.log('Incorrecto');
        playerData = await updatePlayerData(quizId, questionId, playerId, 0);
      }

      io.to(quizId).emit('answerSubmitted', playerData);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
