import { getQuiz } from '../../models/quiz/index.js'
import {
    getPlayersData,
    getQuizData,
    getQuestionState,
    storeQuizDataInRedis,
    masterState,
    getExecutedQuestions,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

export default function getQuizDataHandler(socket, io) {
    socket.on('getQuizData', async (id, loggedUserId) => {
        const quizId = id.toString()
        try {
            if (loggedUserId) {
                //Se comprueba si existe quiz iniciado en Redis:
                let quizFromRedis = await getQuizData(quizId, socket)

                //En caso afirmativo, se traen los datos actualizados:
                let currentQuestion
                let executedQuestions
                let listOfQuestions
                if (quizFromRedis && Object.keys(quizFromRedis).length > 1) {
                    listOfQuestions =
                        JSON.parse(quizFromRedis.list_of_questions) ||
                        quizFromRedis.list_of_questions

                    currentQuestion = await getQuestionState(quizId, socket)
                    executedQuestions = await getExecutedQuestions(
                        quizId,
                        socket
                    )
                }

                //En caso negativo, se recupera el quiz de MySQL y se guarda en Redis:
                if (
                    !quizFromRedis ||
                    (quizFromRedis && Object.keys(quizFromRedis).length <= 1)
                ) {
                    const quizFromDb = await getQuiz(loggedUserId, quizId)
                    await storeQuizDataInRedis(quizFromDb, socket)
                    quizFromRedis = await getQuizData(quizId, socket)
                    listOfQuestions = JSON.parse(
                        quizFromRedis.list_of_questions
                    )
                }

                //Se preparan los datos para enviar:
                let DataToSend = {}
                if (quizFromRedis) {
                    DataToSend = {
                        title: quizFromRedis.title,
                        description: quizFromRedis.description,
                        access_code: quizFromRedis.access_code,
                        id: quizFromRedis.id,
                        owner_id: quizFromRedis.ownerId,
                        number_of_questions: quizFromRedis.number_of_questions,
                        list_of_questions: listOfQuestions,
                    }
                }

                //Se traen los jugadores de Redis, por si se conectaron antes que el master:
                const allPlayers = await getPlayersData(quizId, socket)

                //Se emiten los datos para el master:
                if (socket && loggedUserId == quizFromRedis.ownerId) {
                    await masterState(quizId, { state: true }, socket)
                    socket.data.isMaster = true
                    socket.emit(
                        'quizData',
                        DataToSend,
                        allPlayers,
                        currentQuestion,
                        executedQuestions
                    )
                }

                //Para los jugadores:
                io.to(quizId).emit('firstData', DataToSend)
            }
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
