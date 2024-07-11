import { updateQuestionData } from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const updateQuestionDataHandler = (socket, io) => {
    try {
        socket.on('updateQuestionData', async (quizId, questionData) => {
            let dataUpdated

            // Actualizo datos de la pregunta en Redis:
            if (questionData) {
                dataUpdated = await updateQuestionData(
                    questionData,
                    quizId,
                    socket
                )
            }

            if (dataUpdated) {
                io.to(quizId).emit('questionUpdatedMessage', {
                    message: 'Pregunta actualizada correctamente',
                    status: 'ok',
                    questionUpdated: questionData,
                })
            }
            if (dataUpdated === null) {
                socket.emit('questionUpdatedMessage', {
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
