import {
    getQuestionByQuestionNumber,
    updatePlayerData,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const submitAnswerHandler = (socket, io) => {
    socket.on('submitAnswer', async (data) => {
        try {
            const { quizId, questionId, answer, playerId, questionNumber } =
                data

            const currentQuestion = await getQuestionByQuestionNumber(
                quizId,
                questionNumber,
                socket
            )
            let playerData = {}
            if (currentQuestion.correctAnswer === answer) {
                playerData = await updatePlayerData(
                    quizId,
                    questionId,
                    playerId,
                    1,
                    socket
                )
            } else {
                playerData = await updatePlayerData(
                    quizId,
                    questionId,
                    playerId,
                    0,
                    socket
                )
            }

            io.to(quizId).emit('answerSubmitted', playerData)
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default submitAnswerHandler
