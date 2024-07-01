import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function getConditionalStates(quizId) {
    const quizKey = `quiz:${quizId}`
    try {
        const updatedStates = await redisClient.hGet(
            quizKey,
            'conditional states'
        )
        if (updatedStates) {
            console.log(`States found for quiz ${quizId}`)
            return JSON.parse(updatedStates)
        } else {
            console.log('No hay estados que actualizar')
            return null
        }
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
