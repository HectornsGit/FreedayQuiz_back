const countDown = (socket, io) => {
    let questionTimer = {}
    let timeLeft
    socket.on('startAutomaticCountDown', (quizId, startTime) => {
        const timerInterval = setInterval(async () => {
            startTime -= 1
            timeLeft = startTime
            io.to(quizId).emit('countDown', startTime)

            if (startTime <= 0) {
                clearInterval(timerInterval)
            }
        }, 1000)
        //Referencia del intervalo:
        questionTimer[quizId] = { timerInterval }
    })

    socket.on('pauseQuiz', (quizId) => {
        if (questionTimer[quizId]) {
            clearInterval(questionTimer[quizId].timerInterval)
            delete questionTimer[quizId]
            console.log('Intervalo pausado')
            io.to(quizId).emit('quizPausedStart', timeLeft)
        }
    })
}
export default countDown
