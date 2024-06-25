import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

// Como argumento, recibo el quiz de la base de datos MySQL:
export async function storeQuizDataInRedis(quizData, socket) {
    // Creo una key para el quiz:
    const quizKey = `quiz:${quizData.id}`
    try {
        // Guardo los datos generales usando la estructura: clave, hash y datos:
        await redisClient.hSet(quizKey, 'id', quizData.id)
        await redisClient.hSet(quizKey, 'title', quizData.title)
        await redisClient.hSet(quizKey, 'description', quizData.description)
        await redisClient.hSet(quizKey, 'ownerId', quizData.owner_id)
        await redisClient.hSet(quizKey, 'access_code', quizData.access_code)

        // Guardo las preguntas de forma separada, con un key para cada una, para la fácil obtención y edición de cada una:
        quizData.questions.forEach(async (question) => {
            const questionKey = `quiz:${quizData.id}:question:${question.questionNumber}`
            await redisClient.set(questionKey, JSON.stringify(question))
        })
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
