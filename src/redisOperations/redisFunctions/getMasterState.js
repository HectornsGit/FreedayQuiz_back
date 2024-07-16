import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function getMasterState(quizId) {
    const quizKey = `quiz:${quizId}`
    try {
        const updatedState = await redisClient.hGet(quizKey, 'is master online')
        if (updatedState) {
            console.log(`Master state found for quiz ${quizId}`)
            return JSON.parse(updatedState)
        } else {
            console.log('No hay estado que actualizar')
            return undefined
        }
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
