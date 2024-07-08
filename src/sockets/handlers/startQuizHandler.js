import {
    getQuestionByQuestionNumber,
    questionState,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const startQuizHandler = (socket, io) => {
    socket.on('startQuiz', async (id) => {
        const quizId = id.toString()
        try {
            const firstQuestionNumber = 1
            const firstQuestion = await getQuestionByQuestionNumber(
                quizId,
                firstQuestionNumber,
                socket
            )
            if (firstQuestion) {
                //Emitir la primera pregunta a la sala correspondiente
                io.to(quizId).emit('question', firstQuestion)

                //Guardar la pregunta en el estado question:
                await questionState(quizId, firstQuestion, socket)
            } else {
                socket.emit('noMoreQuestions', () => {})
                console.log('No hay más preguntas')
            }
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default startQuizHandler
