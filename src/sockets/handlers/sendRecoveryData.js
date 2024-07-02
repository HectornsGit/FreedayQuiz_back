import {
    getConditionalStates,
    getPlayersData,
    getQuestionByQuestionNumber,
    getQuestionState,
    getQuizData,
} from '../../redisOperations/redisFunctions/index.js'

const sendRecoveryData = async (socket, io) => {
    socket.on('requestRecoveryData', async (quizId) => {
        //Se une al cliente a la sala:
        socket.join(quizId)

        //Se recuperan y se envían los datos a todos los clientes de la sala:
        const playerData = await getPlayersData(quizId, socket)
        const quizData = await getQuizData(quizId, socket)
        const currentQuestion = await getQuestionState(quizId, socket)
        const updatedStates = await getConditionalStates(quizId)

        //Si no existe currentQuestion, se envía la pregunta número 1 al estado:
        let firstQuestion
        if (!currentQuestion) {
            firstQuestion = await getQuestionByQuestionNumber(
                quizId,
                '1',
                socket
            )
        }
        const quizDataToSend = {
            title: quizData.title,
            description: quizData.description,
            access_code: quizData.access_code,
            id: quizData.id,
            owner_id: quizData.ownerId,
            number_of_questions: quizData.number_of_questions,
        }

        const question = currentQuestion || firstQuestion
        const newStates = updatedStates || {
            isQuestionRunning: false,
            showScores: false,
            isDisabled: true,
        }

        socket.emit(
            'sendRecoveryQuizData',
            playerData,
            quizDataToSend,
            question,
            newStates
        )
    })
}
export default sendRecoveryData
