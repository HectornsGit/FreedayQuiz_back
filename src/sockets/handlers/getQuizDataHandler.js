import { getQuiz } from '../../models/quiz/index.js'
import {
    getPlayersData,
    getQuizData,
    getQuestionState,
    storeQuizDataInRedis,
    masterState,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

export default function getQuizDataHandler(socket, io) {
    socket.on('getQuizData', async (id, loggedUserId) => {
        const quizId = id.toString()

        try {
            //MySQL:
            //Se recupera el quiz:
            const quiz = await getQuiz(loggedUserId, quizId)

            //Redis:
            //Se traen los jugadores, por si se conectaron antes que el master:
            const allPlayers = await getPlayersData(quizId, socket)

            //Se trae la pregunta actual, por si el master ha salido de la partida o refrescado la página:
            const currentQuestion = await getQuestionState(quizId, socket)

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

                if (socket && loggedUserId == updatedData.ownerId) {
                    await masterState(quizId, { state: true }, socket)
                    io.to(quizId).emit(
                        'quizData',
                        DataToSend,
                        allPlayers,
                        currentQuestion
                    )
                }
            }
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
