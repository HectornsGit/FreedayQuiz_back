import { updateQuestions, updateQuiz} from '../../models/quiz/index.js';
import {
  deleteAllData,
  getAllQuestions,
  getQuizData,
} from '../../redisOperations/redisFunctions/index.js';
import { handleSocketErrors } from '../../utils/index.js';

const endQuizHandler = (socket, io) => {
  socket.on('endQuiz', async (quizId, numberOfQuestions) => {
    try {
      //Actualizo los datos de MySQL con los datos de Redis:

      //Redis:
      const currentQuizData = await getQuizData(quizId);
      const allQuestions = await getAllQuestions(quizId, numberOfQuestions);
      
      
      //MysQL:
      await updateQuiz(currentQuizData);
      allQuestions.map(async (question)=>{
        return await updateQuestions(question)
      })
      
      //Elimino todos los datos en Redis:
      await deleteAllData(quizId);

      //Emito el evento al front:
      io.to(quizId).emit('quizEnded', { message: "Datos guardados en la base de datos" });
    } catch (error) {
      handleSocketErrors(error, socket);
    }
  });
};
export default endQuizHandler;
