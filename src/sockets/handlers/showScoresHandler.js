import {
    clickedResponses,
    conditionalStates,
} from '../../redisOperations/redisFunctions/index.js'

const showScoresHandler = (socket, io) => {
    socket.on('showScores', async (quizId, state) => {
        await conditionalStates(quizId, state)
        // await clickedResponses(quizId, hitsResults)
        io.to(quizId).emit('scores')
    })
}
export default showScoresHandler
