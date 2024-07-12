import {
    clickedResponses,
    conditionalStates,
} from '../../redisOperations/redisFunctions/index.js'

const showScoresHandler = (socket, io) => {
    socket.on('showScores', async (quizId, state, hitsResults) => {
        await conditionalStates(quizId, state)
        await clickedResponses(quizId, hitsResults)
        io.to(quizId).emit('scores', hitsResults)
    })
}
export default showScoresHandler
