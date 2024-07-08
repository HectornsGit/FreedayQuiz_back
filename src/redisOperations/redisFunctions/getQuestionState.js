import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function getQuestionState(quizId, socket) {
    const quizKey = `quiz:${quizId}`
    try {
        const currentQuestion = await redisClient.hGet(
            quizKey,
            'current question'
        )
        if (currentQuestion) {
            console.log(`Question found for quiz ${quizId}`)
            return JSON.parse(currentQuestion)
        } else {
            console.log('QuestionState: Pregunta no encontrada')
            return undefined
        }
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
