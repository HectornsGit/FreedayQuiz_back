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
    joinRoomHandler,
    setOnlineHandler,
    disconnectHandler,
    startQuizSession,
    deleteQuestionHandler,
    sendResult,
    requestSetWinnerOn,
    countDown,
    enableButtons,
} from './handlers/index.js'

export default (io) => {
    io.on('connection', async (socket) => {
        //Conexión a la sala:
        joinRoomHandler(socket, io)

        //Se une el nuevo cliente en la sala del quiz y se le envían todos los datos necesarios para que los sincronice en su IU, tanto al conectarse como al reconectarse:
        sendRecoveryData(socket, io)

        //Tras la conexión o recuperación de sesión:
        setOnlineHandler(socket, io)

        //Guardamos el quiz correspondiente con el quizId en Redis:
        getQuizDataHandler(socket, io)

        //Se establece el tiempo máximo de la sessión:
        startQuizSession(socket, io)

        //El jugador pone su nickname y se une al quiz. Sus datos se guardan en Redis
        joinQuizHandler(socket, io)

        //Iniciar la pregunta actual para los jugadores:
        startQuestionHandler(socket, io)

        //El master trae la primera pregunta a su IU. Tras editarla, o no, se guardan los datos del quiz en Redis y se envía la primera pregunta al cliente, para que esté actualizada en sus estados.
        startQuizHandler(socket, io)

        //Se escucha la respuesta del jugador, se compara con la respuesta correcta y se actualizan los datos para enviárselos al front:
        submitAnswerHandler(socket, io)

        //Se envía la siguiente pregunta y se actualiza el estado question:
        nextQuestionHandler(socket, io)

        //Se envía el evento para activar las puntuaciones en todos los clientes de la sala:
        showScoresHandler(socket, io)

        //Activar ganador
        requestSetWinnerOn(socket, io)

        //Para enviar el número de respuestas a cada botón:
        sendResult(socket, io)

        countDown(socket, io)

        enableButtons(socket, io)

        //Se actualizan los datos del quiz en Redis:
        updateQuizDataHandler(socket, io)

        //Se actualizan los datos de la pregunta en Redis:
        updateQuestionDataHandler(socket, io)

        //Para borrar en tiempo real una pregunta de Redis:
        deleteQuestionHandler(socket, io)

        //Finalizar el quiz, actualizar los datos en MySQL y borrarlos de Redis:
        endQuizHandler(socket, io)

        disconnectHandler(socket, io)
    })
}
