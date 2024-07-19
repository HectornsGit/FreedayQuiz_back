import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function getQuizData(quizId, socket) {
    const quizKey = `quiz:${quizId}`
    try {
        const currentData = await redisClient.hGetAll(quizKey)
        if (Object.keys(currentData).length <= 0) {
            console.log(`Quiz ${quizId} not found`)
            return null
        }
        console.log(`Get quiz: Data found for quiz ${quizId}`)
        return currentData
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
