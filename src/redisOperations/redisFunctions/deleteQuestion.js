import { handleSocketErrors } from '../../utils/index.js'
import redisClient from '../redisClient.js'

const deleteQuestion = async (quizId, questionNumber, socket) => {
    try {
        const questionKey = `quiz:${quizId}:question:${questionNumber}`
        await redisClient.del(questionKey)
        console.log(`Question ${questionNumber} deleted from quiz ${quizId}`)
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
export default deleteQuestion
