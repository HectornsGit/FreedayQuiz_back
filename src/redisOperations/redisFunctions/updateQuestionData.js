import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'
import { questionState } from './questionState.js'

export default async function updateQuestionData(questionData, quizId, socket) {
    const quizKey = `quiz:${quizId}:question:${questionData.questionNumber}`

    try {
        // Obtener los datos actuales de la pregunta en Redis
        const currentData = await redisClient.get(quizKey)
        const parsedData = JSON.parse(currentData)

        // // Preparo los campos que se van a actualizar
        const fieldsToUpdate = {}
        if (parsedData.question !== questionData.question)
            fieldsToUpdate.question = questionData.question

        if (parsedData.questionTime !== questionData.questionTime)
            fieldsToUpdate.questionTime = questionData.questionTime

        if (parsedData.optionA !== questionData.optionA)
            fieldsToUpdate.optionA = questionData.optionA

        if (parsedData.optionB !== questionData.optionB)
            fieldsToUpdate.optionB = questionData.optionB

        if (parsedData.optionC !== questionData.optionC)
            fieldsToUpdate.optionC = questionData.optionC

        if (parsedData.correctAnswer !== questionData.correctAnswer)
            fieldsToUpdate.correctAnswer = questionData.correctAnswer

        const readyData = { ...parsedData, ...fieldsToUpdate }

        // // Si hay campos para actualizar, hacer la actualización en Redis
        if (Object.keys(fieldsToUpdate).length > 0) {
            await redisClient.set(quizKey, JSON.stringify(readyData))
            await questionState(quizId, readyData, socket)
            console.log('Datos actualizados correctamente en Redis')
            return readyData
        } else {
            console.log('No hay cambios para actualizar')
            return null
        }
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
