import { getQuiz } from '../models/quiz/index.js';
import {
  storeQuizDataInRedis,
  saveInitialPlayerData,
  updatePlayerData,
  deleteAllData,
} from '../redisOperations/redisFunctions/index.js';
import { getQuestionByQuestionNumber } from '../redisOperations/redisFunctions/index.js';
import { handleSocketErrors } from '../utils/index.js';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('getQuizData', async (loggedUserId, quizId) => {
      try {
        const quiz = await getQuiz(loggedUserId, quizId);

        await storeQuizDataInRedis(quiz);

        socket.join(quizId);
        io.to(quizId).emit('quizData', quiz);
      } catch (error) {
        handleSocketErrors(error, socket);
      }
    });

    //El jugador pone su nickname y se une al quiz. Sus datos se guardan en Redis
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

    //El master inicia el quiz. Se guardan los datos del quiz en Redis y se envía la primera pregunta al cliente
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

    //Se escucha la respuesta del jugador y se compara con la respuesta correcta y se actualizan los datos para enviárselos al front:
    socket.on('submitAnswer', async (data) => {
      try {
        const { quizId, questionId, answer, playerId, questionNumber } = data;

        const currentQuestion = await getQuestionByQuestionNumber(
          quizId,
          questionNumber
        );
        let playerData = {};
        if (currentQuestion.correctAnswer === answer) {
          playerData = await updatePlayerData(quizId, questionId, playerId, 1);
        } else {
          playerData = await updatePlayerData(quizId, questionId, playerId, 0);
        }

        io.to(quizId).emit('answerSubmitted', playerData);
      } catch (error) {
        handleSocketErrors(error, socket);
      }
    });

    socket.on('nextQuestion', async (quizId, questionNumber) => {
      try {
        const question = await getQuestionByQuestionNumber(
          quizId,
          questionNumber
        );

        if (question) {
          io.to(quizId).emit('question', question);
        } else {
          io.to(quizId).emit('quizEnded');
        }
      } catch (error) {
        handleSocketErrors(error, socket);
      }
    });

    //Finalizar el quiz y borrar los datos de Redis:
    socket.on('endQuiz', async (quizId) => {
      try {
        await deleteAllData(quizId);
        io.to(quizId).emit('quizEnded', { quizId });
      } catch (error) {
        handleSocketErrors(error, socket);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
