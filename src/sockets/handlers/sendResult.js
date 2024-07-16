import { clickedResponses } from '../../redisOperations/redisFunctions/index.js'

const sendResult = (socket, io) => {
    socket.on('sendResults', async (quizId, hitsResults) => {
        await clickedResponses(quizId, hitsResults)
        io.to(quizId).emit('results', hitsResults)
    })
}
export default sendResult
