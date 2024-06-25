import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function getQuizData(quizId, socket) {
    const quizKey = `quiz:${quizId}`
    try {
        const currentData = await redisClient.hGetAll(quizKey)
        if (!currentData) {
            generateError(`Quiz ${quizId} not found`)
            return null
        }

        return currentData
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
