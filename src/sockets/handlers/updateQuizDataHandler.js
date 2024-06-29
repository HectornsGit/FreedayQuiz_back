import { updateQuizData } from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const updateQuizDataHandler = (socket, io) => {
    try {
        socket.on('updateQuizData', async (quizId, quizData) => {
            //Actualizo datos del quiz en Redis:
            const updatedData = await updateQuizData(quizData, socket)

            if (updatedData) {
                io.to(quizId).emit('quizUpdatedMessage', {
                    status: 'ok',
                    message: 'Datos del quiz actualizados correctamente',
                    quizUpdated: quizData,
                })
            } else {
                io.to(quizId).emit('quizUpdatedMessage', {
                    status: 'error',
                    message: 'No hay datos para actualizar',
                    quizUpdated: quizData,
                })
            }
        })
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
export default updateQuizDataHandler
