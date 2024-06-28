import { updateQuestionData } from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const updateQuestionDataHandler = (socket, io) => {
    try {
        socket.on('updateQuestionData', async (quizId, questionData) => {
            // Actualizo datos de la pregunta en Redis:
            const dataUpdated = await updateQuestionData(
                questionData,
                quizId,
                socket
            )

            if (dataUpdated) {
                io.to(quizId).emit('questionUpdatedMessage', {
                    message: 'Pregunta actualizada correctamente',
                    status: 'ok',
                    questionUpdated: questionData,
                })
            } else {
                io.to(quizId).emit('questionUpdatedMessage', {
                    message: 'No se pudieron actualizar los datos',
                    status: 'error',
                })
            }
        })
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
export default updateQuestionDataHandler
