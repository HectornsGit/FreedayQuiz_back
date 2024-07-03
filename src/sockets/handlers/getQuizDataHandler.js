import { getQuiz } from '../../models/quiz/index.js'
import {
    getQuizData,
    storeQuizDataInRedis,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

export default function getQuizDataHandler(socket, io) {
    socket.on('getQuizData', async (id, loggedUserId) => {
        const quizId = id.toString()
        try {
            //MySQL:
            const quiz = await getQuiz(loggedUserId, quizId)
            //Redis:
            if (quiz) {
                await storeQuizDataInRedis(quiz, socket)
                const updatedData = await getQuizData(quizId, socket)
                const DataToSend = {
                    title: updatedData.title,
                    description: updatedData.description,
                    access_code: updatedData.access_code,
                    id: updatedData.id,
                    owner_id: updatedData.ownerId,
                    number_of_questions: updatedData.number_of_questions,
                }
                // socket.join(quizId)
                io.to(quizId).emit('quizData', DataToSend)
            }
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
