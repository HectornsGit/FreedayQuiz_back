import { endQuizUtil } from '../../utils/index.js'

const quizTimers = {}

const startQuizSession = (socket, io) => {
    socket.on('startSession', (duration, quizId, numberOfQuestions) => {
        const timeInMiliseconds = duration * 60 * 1000
        let timeInSeconds = duration * 60

        //Iniciar sesión:
        const timeLeft = setInterval(() => {
            io.to(quizId).emit('sessionTimeLeft', timeInSeconds)
            timeInSeconds--
        }, 1000)

        //Establecer fin de sesión:
        const timer = setTimeout(() => {
            const ready = endQuizUtil(quizId, socket, numberOfQuestions)
            if (ready) {
                io.to(quizId).emit('quizEnded', { message: 'Sesión expirada' })
                clearInterval(timer)
                clearInterval(timeLeft)
            }
        }, timeInMiliseconds)

        //Aquí guardo los intervalos para cerrarlos desde el evento de abajo:
        quizTimers[quizId] = { timer, timeLeft }
    })

    socket.on('closeSessionIntervals', (quizId) => {
        if (quizTimers[quizId]) {
            clearInterval(quizTimers[quizId].timer)
            clearInterval(quizTimers[quizId].timeLeft)
            delete quizTimers[quizId]
            console.log('Intervalos finalizados')
        }
    })
}
export default startQuizSession
