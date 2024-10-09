const countDown = (socket, io) => {
    let questionTimer = {}
    socket.on('startAutomaticCountDown', (quizId, startTime) => {
        const timerInterval = setInterval(async () => {
            startTime -= 1
            io.to(quizId).emit('countDown', startTime)

            if (startTime <= 0) {
                clearInterval(timerInterval)
                delete questionTimer[quizId]
            }
        }, 1000)

        //Referencia del intervalo:
        questionTimer[quizId] = { timerInterval }
    })

    socket.on('pauseQuiz', (quizId) => {
        if (questionTimer[quizId]) {
            clearInterval(questionTimer[quizId].timerInterval)
            console.log('Intervalo pausado')
        }
    })
}
export default countDown
