import { handleSocketErrors, generateError } from '../../utils/index.js'
import redisClient from '../redisClient.js'

export async function getQuestionByQuestionNumber(
    quizId,
    questionNumber,
    socket
) {
    try {
        //En este caso se guarda cada pregunta con un key único, dentro del key general de quiz (quizId). De esta forma es más facil recuperar y actualizar la información de la pregunta.
        const questionKey = `quiz:${quizId}:question:${questionNumber}`
        const retrievedQuestion = await redisClient.get(questionKey)

        const questionObject = JSON.parse(retrievedQuestion)
        return questionObject
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
