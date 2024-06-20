import {
  endQuizHandler,
  getQuizDataHandler,
  joinQuizHandler,
  nextQuestionHandler,
  startQuizHandler,
  submitAnswerHandler,
  updateQuestionDataHandler,
  updateQuizDataHandler,
} from './handlers/index.js';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    //Guardamos el quiz correspondiente el quizId en Redis:
    getQuizDataHandler(socket, io);

    //El jugador pone su nickname y se une al quiz. Sus datos se guardan en Redis
    joinQuizHandler(socket, io);

    //El master inicia el quiz. Se guardan los datos del quiz en Redis y se envía la primera pregunta al cliente
    startQuizHandler(socket, io);

    //Se escucha la respuesta del jugador y se compara con la respuesta correcta y se actualizan los datos para enviárselos al front:
    submitAnswerHandler(socket, io);

    //Se envía la siguiente pregunta:
    nextQuestionHandler(socket, io);

    //Se actualizan los datos del quiz en Redis:
    updateQuizDataHandler(socket, io);

    //Se actualizan los datos de la question en Redis:
    updateQuestionDataHandler(socket, io);

    //Finalizar el quiz, actualizar los datos en MySQL y borrarlos de Redis:
    endQuizHandler(socket, io);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
