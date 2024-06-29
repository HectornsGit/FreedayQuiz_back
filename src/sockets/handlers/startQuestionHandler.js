import { getQuestionState } from '../../redisOperations/redisFunctions/index.js'
const startQuestionHandler = (socket, io) => {
    socket.on('startQuestion', async (quizId) => {
        //Emito un evento para setear el estado isQuestionRunning:
        io.to(quizId).emit('questionStarted', quizId)

        //Traigo la pregunta actual del estado en Redis:
        const currentQuestion = await getQuestionState(quizId, socket)
        let timeLeft = currentQuestion.questionTime
        const timerInterval = setInterval(() => {
            timeLeft -= 1
            io.to(quizId).emit('timerUpdate', timeLeft)

            if (timeLeft <= 0) {
                clearInterval(timerInterval)
                io.to(quizId).emit('timeUp')
            }
        }, 1000)
    })
}
export default startQuestionHandler
