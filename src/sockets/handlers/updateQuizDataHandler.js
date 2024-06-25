import { updateQuizData } from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const updateQuizDataHandler = (socket, io) => {
    try {
        socket.on('updateQuizData', async (quizId, quizData) => {
            //Actualizo datos del quiz en Redis:
            await updateQuizData(quizData, socket)
            io.to(quizId).emit('quizUpdatedMessage', {
                message: 'Datos del quiz actualizados correctamente',
            })
        })
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
export default updateQuizDataHandler
