import {
    getQuestionByQuestionNumber,
    questionState,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const startQuizHandler = (socket, io) => {
    socket.on('startQuiz', async (_loggedUserId, quizId) => {
        try {
            //Lógica por si la primera pregunta no es la 1. Se valoran los 10 primeros dígitos:
            let firstQuestion
            for (let i = 0; i < 10; i++) {
                let firstQuestionNumber = i + 1
                firstQuestion = await getQuestionByQuestionNumber(
                    quizId,
                    firstQuestionNumber,
                    socket
                )
                if (firstQuestion) break
            }
            console.log('first', firstQuestion)
            if (firstQuestion) {
                //Emitir la primera pregunta a la sala correspondiente
                io.to(quizId).emit('question', firstQuestion)

                //Guardar la pregunta en el estado question:
                await questionState(quizId, firstQuestion, socket)
            } else {
                socket.emit('noMoreQuestions', () => {})
                console.log('No hay preguntas')
            }
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default startQuizHandler
