import { handleSocketErrors } from '../../utils/index.js'
import redisClient from '../redisClient.js'

export async function getAllQuestions(quizId, numberOfQuestions, socket) {
    try {
        const questions = []

        for (let i = 1; i <= numberOfQuestions; i++) {
            const questionKey = `quiz:${quizId}:question:${i}`
            const question = await redisClient.get(questionKey)
            if (question) {
                questions.push(JSON.parse(question))
            }
        }

        return questions
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
