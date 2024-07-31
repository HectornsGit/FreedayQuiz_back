const requestSetWinnerOn = (socket, io) => {
    socket.on('requestSetWinnerOn', (quizId) => {
        io.to(quizId).emit('setWinnerOn')
    })
}
export default requestSetWinnerOn
