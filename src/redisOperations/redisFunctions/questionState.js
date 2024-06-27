import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function questionState(quizId, question, socket) {
    const quizKey = `quiz:${quizId}`
    try {
        await redisClient.hSet(
            quizKey,
            'current question',
            JSON.stringify(question)
        )

        console.log(`Question state updated for quiz ${quizId}`)
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
