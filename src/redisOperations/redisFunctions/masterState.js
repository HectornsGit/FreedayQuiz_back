import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function masterState(quizId, state, socket) {
    const quizKey = `quiz:${quizId}`
    try {
        await redisClient.hSet(
            quizKey,
            'is master online',
            JSON.stringify(state)
        )

        console.log(`Master state updated for quiz ${quizId}`)
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
