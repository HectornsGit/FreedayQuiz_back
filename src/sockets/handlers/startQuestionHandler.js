import {
    conditionalStates,
    getQuestionState,
    executedQuestions,
    getQuizData,
    getExecutedQuestions,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const questionTimer = {}
let timeLeft

const startQuestionHandler = (socket, io) => {
    try {
        socket.on('startQuestion', async (quizId, states, automatic = {}) => {
            try {
                if (questionTimer[quizId]) {
                    clearInterval(questionTimer[quizId].timerInterval)
                }

                if (!automatic.newQuestionTime) {
                    //Guardo los estados condicionales para su recuperación en caso de reconexión con el servidor:
                    await conditionalStates(quizId, states)

                    const quizData = await getQuizData(quizId, socket)

                    //Traigo la pregunta actual del estado en Redis, sino, traigo la seleccionada:
                    const currentQuestion = await getQuestionState(
                        quizId,
                        socket
                    )
                    timeLeft = currentQuestion.questionTime

                    //Guardo el número en la lista de preguntas ya ejecutadas:
                    const questionExecuted = currentQuestion.questionNumber
                    await executedQuestions(quizId, questionExecuted, socket)

                    const executedList = await getExecutedQuestions(
                        quizId,
                        socket
                    )

                    //Emito un evento para setear el estado isQuestionRunning y enviar los datos al sistema automático del quiz:
                    io.to(quizId).emit('questionStarted', quizId, {
                        ...automatic,
                        number_of_questions: quizData.number_of_questions,
                        list_of_questions: quizData.list_of_questions,
                        executedList,
                        quizId,
                        timeLeft,
                    })
                }

                //Emito el timer y el fin del tiempo:
                timeLeft = automatic.newQuestionTime
                    ? automatic.newQuestionTime
                    : timeLeft

                const timerInterval = setInterval(async () => {
                    try {
                        timeLeft -= 1
                        io.to(quizId).emit('timerUpdate', timeLeft)

                        if (timeLeft <= 0 || timeLeft === null) {
                            clearInterval(timerInterval)
                            delete questionTimer[quizId]
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
                    } catch (error) {
                        clearInterval(timerInterval)
                        console.error(
                            'Error durante la ejecución del temporizador',
                            error
                        )
                        handleSocketErrors(error, socket)
                    }
                }, 1000)
                questionTimer[quizId] = { timerInterval }
            } catch (error) {
                console.error('Error en el evento startQuestion', error)
                handleSocketErrors(error, socket)
            }
        })

        socket.on('closeQuestionInterval', (quizId, timeUp = false) => {
            try {
                if (questionTimer[quizId]) {
                    clearInterval(questionTimer[quizId].timerInterval)
                    delete questionTimer[quizId]
                    console.log('Intervalo de la pregunta finalizado')
                }
                if (timeUp) io.to(quizId).emit('timeUp')
                if (timeUp) io.to(quizId).emit('timeUp2')
            } catch (error) {
                console.error('Error en closeQuestionInterval', error)
                handleSocketErrors(error, socket)
            }
        })

        socket.on('pauseQuiz', (quizId) => {
            try {
                if (questionTimer[quizId]) {
                    clearInterval(questionTimer[quizId].timerInterval)
                    io.to(quizId).emit('quizPausedQuestion', timeLeft)
                    console.log('Intervalo de la pregunta, pausado')
                }

                io.to(quizId).emit('disableButtons')
            } catch (error) {
                console.error('Error en el evento pauseQuiz', error)
                handleSocketErrors(error, socket)
            }
        })
    } catch (error) {
        console.log('Error crítico en startQuestionHandler', error)
        handleSocketErrors(error, socket)
    }
}

export default startQuestionHandler
