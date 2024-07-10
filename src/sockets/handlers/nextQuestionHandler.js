import {
    getQuestionByQuestionNumber,
    questionState,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const nextQuestionHandler = (socket, io) => {
    socket.on(
        'nextQuestion',
        async (quizId, questionNumber, numberOfQuestions, direction) => {
            try {
                const question = await getQuestionByQuestionNumber(
                    quizId,
                    questionNumber,
                    socket,
                    numberOfQuestions,
                    direction
                )
                if (question) {
                    io.to(quizId).emit('question', question)

                    //Se actualiza el estado question:
                    await questionState(quizId, question, socket)
                } else {
                    io.to(quizId).emit('noMoreQuestions', () => {})
                    console.log('No hay más preguntas')
                }
            } catch (error) {
                handleSocketErrors(error, socket)
            }
        }
    )
}
export default nextQuestionHandler
