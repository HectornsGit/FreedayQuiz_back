import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

const executedQuestions = async (quizId, questionNumber, socket) => {
    const quizKey = `quiz:${quizId}`
    try {
        const allExecutedQuestions = await redisClient.hGet(
            quizKey,
            'executed questions'
        )

        let newExecutedList = allExecutedQuestions
            ? [...JSON.parse(allExecutedQuestions), questionNumber]
            : [questionNumber]
        await redisClient.hSet(
            quizKey,
            'executed questions',
            JSON.stringify(newExecutedList)
        )

        console.log(
            `Executed questions updated for quiz: ${quizId} Questions: ${newExecutedList}`
        )
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
export default executedQuestions
