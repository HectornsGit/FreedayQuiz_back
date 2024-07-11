import { deleteQuestion } from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const deleteQuestionHandler = (socket) => {
    socket.on('deleteCurrentQuestion', async (quizId, questionNumber) => {
        try {
            await deleteQuestion(quizId, questionNumber, socket)
            socket.emit('questionDeleted', {
                message: `Pregunta ${questionNumber} eliminada correctamente`,
            })
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default deleteQuestionHandler
