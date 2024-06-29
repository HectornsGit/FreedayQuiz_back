import {
    getPlayersData,
    getQuestionState,
    getQuizData,
} from '../../redisOperations/redisFunctions/index.js'

const sendQuizId = async (socket, _io) => {
    socket.on('sendQuizId', async (quizId) => {
        quizId = quizId.toString()
        socket.join(quizId)

        //Se recuperan y se envían los datos a todos los clientes de la sala:
        const playerData = await getPlayersData(quizId, socket)
        const quizData = await getQuizData(quizId, socket)
        const currentQuestion = await getQuestionState(quizId, socket)

        const quizDataToSend = {
            title: quizData.title,
            description: quizData.description,
            access_code: quizData.access_code,
            id: quizData.id,
            owner_id: quizData.ownerId,
            number_of_questions: quizData.number_of_questions,
        }

        socket.emit(
            'sendUpdatedQuizData',
            playerData,
            quizDataToSend,
            currentQuestion
        )
    })
}
export default sendQuizId
