import {
    getMasterState,
    getQuizData,
} from '../../redisOperations/redisFunctions/index.js'

const joinRoomHandler = (socket, io) => {
    let quizId
    socket.on('joinRoom', async (id) => {
        quizId = id
        socket.join(quizId)
        socket.data.quizId = quizId

        //Se actualiza el número de conectados a la sala:
        if (quizId) {
            const clientsNumber =
                io.sockets.adapter.rooms.get(quizId)?.size || 0
            const state = 'connected'
            io.to(quizId).emit(
                'clientsNumber',
                clientsNumber,
                socket.data,
                state
            )
            console.log('Jugadores en en la sala:', clientsNumber)
        }

        // Se envían los datos básicos del quiz para que estén disponibles en la pantalla de inicio del quiz (antes incluso de ingresar el nombre de usuario) en caso de que el master ya esté online:
        const isMasterOnline = await getMasterState(quizId)
        if (isMasterOnline?.state) {
            //El master sólo entrará aquí si el servidor se cae (No cuando el cliente se desconecte del servidor), momento en que desde el front se envía un aviso al reconectar, para que se reactive el tiempo de la sesión
            const updatedData = await getQuizData(quizId, socket)
            const DataToSend = {
                title: updatedData?.title,
                description: updatedData?.description,
            }

            if (updatedData && socket) {
                socket.emit('firstData', DataToSend)
            }
        }

        // En caso de reconexión dentro del tiempo especificado, se recuperan los datos: socket.id, socket.rooms y socket.data.
        const isMaster = socket.data.isMaster
        if (socket.recovered) {
            isMaster
                ? console.log('Master reconectado', socket.id)
                : console.log('Jugador reconectado', socket.id)
        } else {
            isMaster
                ? console.log('Master conectado', socket.id)
                : console.log('Nuevo jugador conectado', socket.id)
        }
    })
}
export default joinRoomHandler
