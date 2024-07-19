import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

const getExecutedQuestions = async (quizId, socket) => {
    const quizKey = `quiz:${quizId}`
    try {
        const allExecutedQuestions = await redisClient.hGet(
            quizKey,
            'executed questions'
        )
        const executedList = JSON.parse(allExecutedQuestions)

        console.log(
            `Executed questions found for quiz: ${quizId} Questions: ${executedList?.map(
                (question) => question
            )}`
        )
        return executedList
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
export default getExecutedQuestions
