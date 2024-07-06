import {
    endQuizHandler,
    getQuizDataHandler,
    joinQuizHandler,
    nextQuestionHandler,
    startQuizHandler,
    submitAnswerHandler,
    updateQuestionDataHandler,
    updateQuizDataHandler,
    sendRecoveryData,
    startQuestionHandler,
    showScoresHandler,
} from './handlers/index.js'
import redisClient from '../redisOperations/redisClient.js'
import generateError from '../utils/generateError.js'

export default (io) => {
    io.on('connection', async (socket) => {
        //Conexión a la sala:
        let quizId
        socket.on('sendQuizId', async (id) => {
            quizId = id
            socket.join(quizId)
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
        })

        //En caso de reconexión dentro del tiempo especificado, se recuperan los datos: socket.id, socket.rooms y socket.data.
        if (socket.recovered) {
            console.log('Reconexión exitosa', socket.id)
        } else {
            console.log('Nuevo cliente conectado', socket.id)
        }

        //Se une el nuevo cliente en la sala del quiz y se le envían todos los datos necesarios para que los sincronice en su IU, tanto al conectarse como al reconectarse:
        sendRecoveryData(socket, io)

        if (socket) {
            socket.on('setOnline', (data) => {
                socket.data.playerId = data.playerId
                const clientsNumber =
                    io.sockets.adapter.rooms.get(quizId)?.size || 0
                if (clientsNumber) {
                    const state = 'connected'
                    io.to(quizId).emit(
                        'clientsNumber',
                        clientsNumber,
                        data,
                        state
                    )

                    console.log('Jugadores en en la sala:', clientsNumber)
                }
            })
        }

        //Guardamos el quiz correspondiente con el quizId en Redis:
        getQuizDataHandler(socket, io)

        //El jugador pone su nickname y se une al quiz. Sus datos se guardan en Redis
        joinQuizHandler(socket, io)

        //Iniciar la pregunta actual para los jugadores:
        startQuestionHandler(socket, io)

        //El master trae la primera pregunta a su IU. Tras eitarla, o no, se guardan los datos del quiz en Redis y se envía la primera pregunta al cliente, para que esté actualizada en sus estados.
        startQuizHandler(socket, io)

        //Se escucha la respuesta del jugador y se compara con la respuesta correcta y se actualizan los datos para enviárselos al front:
        submitAnswerHandler(socket, io)

        //Se envía la siguiente pregunta y se actualiza el estado question:
        nextQuestionHandler(socket, io)

        //Se envía el evento para activar las puntuaciones en todos los clientes de la sala:
        showScoresHandler(socket, io)

        //Se actualizan los datos del quiz en Redis:
        updateQuizDataHandler(socket, io)

        //Se actualizan los datos de la pregunta en Redis:
        updateQuestionDataHandler(socket, io)

        //Finalizar el quiz, actualizar los datos en MySQL y borrarlos de Redis:
        endQuizHandler(socket, io)

        socket.on('disconnect', async () => {
            //Se actualiza el número de conectados a la sala:
            const clientsNumber =
                io.sockets.adapter.rooms.get(quizId)?.size || 0
            const state = 'disconnect'
            console.log(socket.data, quizId)
            io.to(quizId).emit(
                'clientsNumber',
                clientsNumber,
                socket.data,
                state
            )
            if (socket && socket.data.playerId) {
                //Actualizamos el estado del jugador que se va, para que cuando alguien recuperar sus datos consta que esté offline:
                console.log('22', typeof socket.data.playerId)
                const quizKey = `quiz:${quizId}`
                try {
                    const playerData = await redisClient.hGet(
                        quizKey,
                        socket.data.playerId
                    )
                    console.log('playerdata', playerData)
                    if (playerData) {
                        const parsedData = JSON.parse(playerData)
                        parsedData.state = 'offline'
                        await redisClient.hSet(
                            quizKey,
                            socket.data.playerId,
                            JSON.stringify(parsedData)
                        )
                        console.log('parsed', parsedData)
                        console.log(
                            `Updated state for player ${socket.data.playerId} on quiz ${quizId}`
                        )
                    } else {
                        generateError(
                            `Player data for ${socket.data.playerId} not found in quiz ${quizId}`
                        )
                    }
                } catch (error) {
                    console.log(error.message)
                }
            }

            console.log('Client disconnected', socket.id)
        })
    })
}
