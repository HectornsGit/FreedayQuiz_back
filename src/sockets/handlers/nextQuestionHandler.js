import { getQuestionByQuestionNumber } from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const nextQuestionHandler = (socket, io) => {
    socket.on(
        'nextQuestion',
        async (quizId, questionNumber, numberOfQuestions) => {
            try {
                if (questionNumber <= numberOfQuestions) {
                    const question = await getQuestionByQuestionNumber(
                        quizId,
                        questionNumber,
                        socket
                    )
                    io.to(quizId).emit('question', question)
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
