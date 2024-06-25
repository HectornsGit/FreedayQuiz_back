import { getQuiz } from '../../models/quiz/index.js'
import { storeQuizDataInRedis } from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

export default function getQuizDataHandler(socket, io) {
    socket.on('getQuizData', async (loggedUserId, quizId) => {
        try {
            //MySQL:
            const quiz = await getQuiz(loggedUserId, quizId)
            //Redis:
            await storeQuizDataInRedis(quiz, socket)

            socket.join(quizId)
            io.to(quizId).emit('quizData', quiz)
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
