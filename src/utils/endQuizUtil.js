import {
    updateQuestions,
    updateQuiz,
    deleteQuestion,
} from '../models/quiz/index.js'
import {
    deleteAllData,
    getAllQuestions,
    getQuizData,
} from '../redisOperations/redisFunctions/index.js'
import handleSocketErrors from './handleSocketErrors.js'

const endQuizUtil = async (
    quizId,
    socket,
    numberOfQuestions,
    questionsToDelete
) => {
    try {
        let dataUpdated = false
        let dataDeleted = false

        //Actualizo los datos de MySQL con los datos de Redis:

        //Redis:
        const currentQuizData = await getQuizData(quizId, socket)

        const allQuestions = await getAllQuestions(
            quizId,
            numberOfQuestions,
            socket
        )

        // MySQL:
        if (currentQuizData && allQuestions) {
            await updateQuiz(currentQuizData)
            await Promise.all(
                allQuestions.map(async (question) => {
                    return updateQuestions(question)
                })
            )
            dataUpdated = true
        }

        //Elimino todos los datos en Redis:
        if (dataUpdated) {
            await deleteAllData(quizId, socket)
            dataDeleted = true
            if (questionsToDelete?.length > 0) {
                //MySQL:
                await deleteQuestion(questionsToDelete, quizId)
            }
        }
        return dataDeleted
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
export default endQuizUtil
