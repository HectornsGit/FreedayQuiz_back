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
} from './handlers/index.js'

export default (io) => {
    io.on('connection', async (socket) => {
        //En caso de reconexión dentro del tiempo especificado, se recuperan los datos: socket.id, socket.rooms y socket.data.
        if (socket.recovered) {
            console.log('Reconexión exitosa')
        } else {
            console.log('Nuevo cliente conectado')
        }

        //Se une el nuevo cliente en la sala del quiz y se le envían todos los datos necesarios para que los sincronice en su IU, tanto al conectarse como al reconectarse:
        sendQuizId(socket, io)

        //Guardamos el quiz correspondiente el quizId en Redis:
        getQuizDataHandler(socket, io)

        //El jugador pone su nickname y se une al quiz. Sus datos se guardan en Redis
        joinQuizHandler(socket, io)

        //El master inicia el quiz. Se guardan los datos del quiz en Redis y se envía la primera pregunta al cliente
        startQuizHandler(socket, io)

        //Se escucha la respuesta del jugador y se compara con la respuesta correcta y se actualizan los datos para enviárselos al front:
        submitAnswerHandler(socket, io)

        //Se envía la siguiente pregunta y se actualiza el estado question:
        nextQuestionHandler(socket, io)

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
