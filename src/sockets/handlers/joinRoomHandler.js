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

        //Se envían los datos básicos del quiz para que estén disponibles en la pantalla de inicio del quiz (antes incluso de ingresar el nombnre de usuario) en caso de que el master ya esté online:
        const isMasterOnline = await getMasterState(quizId)
        if (isMasterOnline) {
            const updatedData = await getQuizData(quizId, socket)
            const DataToSend = {
                title: updatedData?.title,
                description: updatedData?.description,
            }

            if (updatedData && socket) {
                socket.emit('firstData', DataToSend)
            }
        }

        //En caso de reconexión dentro del tiempo especificado, se recuperan los datos: socket.id, socket.rooms y socket.data.
        if (socket.recovered) {
            console.log('Reconexión exitosa', socket.id)
        } else {
            console.log('Nuevo cliente conectado', socket.id)
        }
    })
}
export default joinRoomHandler
