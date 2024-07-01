import {
    getQuestionByQuestionNumber,
    updatePlayerData,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const submitAnswerHandler = (socket, io) => {
    socket.on('submitAnswer', async (data) => {
        try {
            const currentQuestion = await getQuestionByQuestionNumber(
                data.quizId,
                data.questionNumber,
                socket
            )

            let playerData = {}
            playerData = await updatePlayerData(data, socket, currentQuestion)

            io.to(data.quizId).emit('answerSubmitted', playerData)
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default submitAnswerHandler
