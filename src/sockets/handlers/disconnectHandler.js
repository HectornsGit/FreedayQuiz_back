import {
    masterState,
    setOnlineState,
} from '../../redisOperations/redisFunctions/index.js'

const disconnectHandler = (socket, io) => {
    socket.on('disconnect', async () => {
        if (socket) {
            //Se actualiza  y se emite el número de conectados a la sala:
            const clientsNumber =
                io.sockets.adapter.rooms.get(socket.data.quizId)?.size || 0
            const state = 'disconnect'

            io.to(socket.data.quizId).emit(
                'clientsNumber',
                clientsNumber,
                socket.data,
                state
            )

            //Actualizamos el estado del jugador que se va, para que cuando alguien recuperar sus datos conste que esté offline:
            if (socket.data.playerId) {
                const state = 'offline'
                await setOnlineState(
                    socket.data.quizId,
                    socket.data.playerId,
                    state
                )
            }
            const master = socket.data?.isMaster
            if (master) {
                await masterState(socket.data.quizId, { state: false }, socket)
                console.log('Master desconectado:', socket.id)
            } else {
                console.log('Jugador desconectado', socket.id)
            }

            console.log('Usuarios restantes en la sala:', clientsNumber)
        }
    })
}
export default disconnectHandler
