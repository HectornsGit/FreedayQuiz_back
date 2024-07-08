import { updateQuestions, updateQuiz } from '../../models/quiz/index.js'
import {
    deleteAllData,
    getAllQuestions,
    getQuizData,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const endQuizHandler = (socket, io) => {
    socket.on('endQuiz', async (quizId, numberOfQuestions) => {
        try {
            let dataUpdated = false
            let dataDeleted = false

            //Actualizo los datos de MySQL con los datos de Redis:

            //Redis:
            const currentQuizData = await getQuizData(quizId, socket)

            const allQuestions = await getAllQuestions(
                quizId,
                numberOfQuestions,
                socket
            )

            // MySQL:
            if (currentQuizData && allQuestions) {
                await updateQuiz(currentQuizData)
                await Promise.all(
                    allQuestions.map(async (question) => {
                        return updateQuestions(question)
                    })
                )
                dataUpdated = true
            }

            //Elimino todos los datos en Redis:
            if (dataUpdated) {
                await deleteAllData(quizId, socket)
                dataDeleted = true
            }

            //Emito el evento al front:
            if (dataDeleted) {
                io.to(quizId).emit('quizEnded', {
                    message: 'Datos guardados en la base de datos',
                })
            }
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default endQuizHandler
