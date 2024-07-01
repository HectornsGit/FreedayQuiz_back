import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function conditionalStates(quizId, states, socket) {
    const quizKey = `quiz:${quizId}`
    try {
        await redisClient.hSet(
            quizKey,
            'conditional states',
            JSON.stringify(states)
        )

        console.log(`States updated for quiz ${quizId}`)
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
