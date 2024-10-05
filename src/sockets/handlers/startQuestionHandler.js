import {
    conditionalStates,
    getQuestionState,
    executedQuestions,
    getQuizData,
    getExecutedQuestions,
} from '../../redisOperations/redisFunctions/index.js'

const questionTimer = {}
let timeLeft

const startQuestionHandler = (socket, io) => {
    socket.on('startQuestion', async (quizId, states, automatic = {}) => {
        if (!automatic.newQuestionTime) {
            //Guardo los estados condicionales para su recuperación en caso de reconexión con el servidor:
            await conditionalStates(quizId, states)

            const quizData = await getQuizData(quizId, socket)

            //Traigo la pregunta actual del estado en Redis, sino, traigo la seleccionada:
            const currentQuestion = await getQuestionState(quizId, socket)
            timeLeft = currentQuestion.questionTime

            //Guardo el número en la lista de preguntas ya ejecutadas:
            const questionExecuted = currentQuestion.questionNumber
            await executedQuestions(quizId, questionExecuted, socket)

            const executedList = await getExecutedQuestions(quizId, socket)

            //Emito un evento para setear el estado isQuestionRunning y enviar los datos al sistema automático del quiz:
            io.to(quizId).emit('questionStarted', quizId, {
                ...automatic,
                number_of_questions: quizData.number_of_questions,
                list_of_questions: quizData.list_of_questions,
                executedList,
                quizId,
            })
        } else {
        }

        //Emito el timer y el fin del tiempo:
        if (!automatic.newQuestionTime) {
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
            questionTimer[quizId] = { timerInterval }
        } else {
            const timerInterval = setInterval(async () => {
                timeLeft = automatic.newQuestionTime
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
            questionTimer[quizId] = { timerInterval }
        }

        // //Aquí guardo la referencia del intervalo de la pregunta en curso:
        // questionTimer[quizId] = { timerInterval }
    })

    socket.on('closeQuestionInterval', (quizId, timeUp = false) => {
        if (questionTimer[quizId]) {
            clearInterval(questionTimer[quizId].timerInterval)
            delete questionTimer[quizId]
            console.log('Intervalo de la pregunta finalizado')
        }
        if (timeUp) io.to(quizId).emit('timeUp')
        if (timeUp) io.to(quizId).emit('timeUp2')
    })

    socket.on('pauseQuiz', (quizId) => {
        if (questionTimer[quizId]) {
            clearInterval(questionTimer[quizId].timerInterval)
            delete questionTimer[quizId]
            console.log('Intervalo de la pregunta, pausado')
        }
        io.to(quizId).emit('quizPausedQuestion', timeLeft)
    })
}
export default startQuestionHandler
