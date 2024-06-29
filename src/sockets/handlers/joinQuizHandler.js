import { saveInitialPlayerData } from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const joinQuizHandler = (socket, io) => {
    socket.on('joinQuiz', async (playerId, quizId, initialPlayerData) => {
        try {
            await saveInitialPlayerData(
                playerId,
                quizId,
                initialPlayerData,
                socket
            )

            io.to(quizId).emit('playerJoined', initialPlayerData)
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default joinQuizHandler
