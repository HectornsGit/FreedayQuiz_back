import { conditionalStates } from '../redisOperations/redisFunctions/conditionalStates.js'
import {
    endQuizHandler,
    getQuizDataHandler,
    joinQuizHandler,
    nextQuestionHandler,
    startQuizHandler,
    submitAnswerHandler,
    updateQuestionDataHandler,
    updateQuizDataHandler,
    sendQuizId,
    startQuestionHandler,
    showScoresHandler,
} from './handlers/index.js'

export default (io) => {
    io.on('connection', async (socket) => {
        //En caso de reconexión dentro del tiempo especificado, se recuperan los datos: socket.id, socket.rooms y socket.data.
        if (socket.recovered) {
            console.log('Reconexión exitosa')
        } else {
            const states = {
                isQuestionRunning: false,
                showScores: false,
                isDisabled: true,
            }
            console.log('Nuevo cliente conectado')
            await conditionalStates('1', states)
        }

        //Se une el nuevo cliente en la sala del quiz y se le envían todos los datos necesarios para que los sincronice en su IU, tanto al conectarse como al reconectarse:
        sendQuizId(socket, io)

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

        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })
}
