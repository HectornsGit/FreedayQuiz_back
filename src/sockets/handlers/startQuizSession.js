const quizTimers = {}

const startQuizSession = (socket, io) => {
    socket.on('startSession', (duration, quizId) => {
        //Cierro los intervalos que puediesen estar ya abiertos:
        clearInterval(quizTimers[quizId]?.timer)
        clearInterval(quizTimers[quizId]?.timeLeft)

        const timeInMiliseconds = duration * 60 * 1000
        let timeInSeconds = duration * 60

        //Iniciar sesión:
        const timeLeft = setInterval(() => {
            io.to(quizId).emit('sessionTimeLeft', timeInSeconds)
            timeInSeconds--
        }, 1000)

        //Establecer fin de sesión:
        const timer = setTimeout(() => {
            io.to(quizId).emit('quizEnded', { message: 'Sesión expirada' })
            clearInterval(timer)
            clearInterval(timeLeft)
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

    socket.on('restartSessionTime', (quizId) => {
        if (quizTimers[quizId]?.timer || quizTimers[quizId]?.timeLeft) {
            return
        } else
            console.log(
                'Enviando restauración de tiempo de sesión tras caída de servidor'
            )
        socket.emit('needToRestartSession')
    })
}
export default startQuizSession
