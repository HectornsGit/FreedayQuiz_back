const showScoresHandler = (socket, io) => {
    socket.on('showScores', (quizId) => {
        io.to(quizId).emit('scores')
    })
}
export default showScoresHandler
