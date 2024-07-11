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

            //Emito el resultado a todos los usuarios de la sala:
            io.to(data.quizId).emit('answerSubmitted', playerData)

            //Emito la notificación solo al usuario que ha respondido:
            socket.emit(
                'answerSubmittedMessage',
                playerData.lastAnswerText,
                playerData.lastAnswer
            )
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default submitAnswerHandler
