import {
    clickedResponses,
    conditionalStates,
} from '../../redisOperations/redisFunctions/index.js'

const showScoresHandler = (socket, io) => {
    socket.on('showScores', async (quizId, state, singleResponse = false) => {
        await conditionalStates(quizId, state)
        // await clickedResponses(quizId, hitsResults)

        if (!singleResponse) {
            io.to(quizId).emit('scores')
        }
    })
}
export default showScoresHandler
