const countDown = (socket, io) => {
    socket.on('startAutomaticCountDown', (quizId) => {
        let timeLeft = 6
        const timerInterval = setInterval(async () => {
            timeLeft -= 1
            io.to(quizId).emit('countDown', timeLeft)

            if (timeLeft <= 0) {
                clearInterval(timerInterval)
            }
        }, 1000)
    })
}
export default countDown
