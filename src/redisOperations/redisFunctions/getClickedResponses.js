import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function getClickedResponses(quizId) {
    const quizKey = `quiz:${quizId}`
    try {
        const updatedResponses = await redisClient.hGet(
            quizKey,
            'clicked responses'
        )
        if (updatedResponses) {
            console.log(`Clicked responses found for quiz ${quizId}`)
            return JSON.parse(updatedResponses)
        } else {
            console.log('No hay respuestas que actualizar')
            return undefined
        }
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
