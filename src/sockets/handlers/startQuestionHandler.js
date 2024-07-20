import {
    conditionalStates,
    getQuestionState,
    executedQuestions,
} from '../../redisOperations/redisFunctions/index.js'
const startQuestionHandler = (socket, io) => {
    socket.on('startQuestion', async (quizId, states) => {
        //Emito un evento para setear el estado isQuestionRunning:
        io.to(quizId).emit('questionStarted', quizId)

        //Guardo los estados condicionales para su recuperación en caso de reconexión con el servidor:
        await conditionalStates(quizId, states)

        //Traigo la pregunta actual del estado en Redis, sino, traigo la seleccionada:
        const currentQuestion = await getQuestionState(quizId, socket)
        let timeLeft = currentQuestion.questionTime

        //Guardo el número en la lista de preguntas ya ejecutadas:
        const questionExecuted = currentQuestion.questionNumber
        await executedQuestions(quizId, questionExecuted, socket)

        //Emito el timer y el fin del tiempo:
        const timerInterval = setInterval(async () => {
            timeLeft -= 1
            io.to(quizId).emit('timerUpdate', timeLeft)

            if (timeLeft <= 0) {
                clearInterval(timerInterval)
                await conditionalStates(
                    quizId,
                    {
                        isQuestionRunning: true,
                        showScores: false,
                        isDisabled: true,
                    },
                    socket
                )
                io.to(quizId).emit('timeUp')
            }
        }, 1000)
    })
}
export default startQuestionHandler
