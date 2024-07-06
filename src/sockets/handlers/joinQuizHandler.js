import {
    getPlayersData,
    saveInitialPlayerData,
} from '../../redisOperations/redisFunctions/index.js'
import { handleSocketErrors } from '../../utils/index.js'

const joinQuizHandler = (socket, io) => {
    socket.on('joinQuiz', async (playerId, quizId, initialPlayerData) => {
        // Asigno los datos del jugador al socket, para gestionar luego si está conectado o desconectado:
        socket.data.username = initialPlayerData.name
        socket.data.playerId = initialPlayerData.id
        socket.data.quizId = quizId

        try {
            await saveInitialPlayerData(
                playerId,
                quizId,
                initialPlayerData,
                socket
            )
            const allPlayers = await getPlayersData(quizId, socket)
            if (allPlayers) io.to(quizId).emit('playerJoined', allPlayers)
        } catch (error) {
            handleSocketErrors(error, socket)
        }
    })
}
export default joinQuizHandler
