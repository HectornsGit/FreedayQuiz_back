import { setOnlineState } from '../../redisOperations/redisFunctions/index.js'

const setOnlineHandler = (socket, io) => {
    if (socket) {
        socket.on('setOnline', async (data, quizId) => {
            socket.data.playerId = data.playerId
            socket.data.quizId = quizId
            const state = 'connected'

            const clientsNumber =
                io.sockets.adapter.rooms.get(quizId)?.size || 0
            if (clientsNumber) {
                io.to(quizId).emit('clientsNumber', clientsNumber, data, state)

                console.log('Jugadores en en la sala:', clientsNumber)
            }
            //Redis:
            await setOnlineState(quizId, data.playerId, state)
        })
    }
}
export default setOnlineHandler
