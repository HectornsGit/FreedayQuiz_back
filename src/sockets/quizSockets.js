import {
  storeUserResponse,
  getUserResponses,
} from '../redisOperations/quizRedis.js';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Aquí puedes agregar tus manejadores de eventos de socket
    socket.on('joinQuiz', (quizId) => {
      // Aquí podrías cargar los datos del quiz desde MySQL si es necesario
    });

    socket.on('submitAnswer', (data) => {
      const { quizId, questionId, answerId, userId } = data;
      storeUserResponse(quizId, userId, questionId, answerId);
      io.to(quizId).emit('answerSubmitted', { userId, questionId, answerId });
    });
    socket.on('getScores', (quizId) => {
      // Implementación de la lógica para calcular puntajes
      getUserResponses(quizId, (err, responses) => {
        if (err) {
          socket.emit('error', 'Error retrieving user responses');
          return;
        }

        // Lógica para calcular puntajes aquí

        const scores = {}; // Calcula los puntajes aquí

        socket.emit('quizScores', scores);
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
