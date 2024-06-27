import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function updateQuizData(quizData, socket) {
    const quizKey = `quiz:${quizData.id}`

    try {
        // Obtener los datos actuales del quiz en Redis
        const currentData = await redisClient.hGetAll(quizKey)

        // Preparo los campos que se van a actualizar
        const fieldsToUpdate = {}
        if (quizData.title && currentData.title !== quizData.title)
            fieldsToUpdate.title = quizData.title
        if (
            quizData.description &&
            currentData.description !== quizData.description
        )
            fieldsToUpdate.description = quizData.description

        // Si hay campos para actualizar, hacer la actualización en Redis
        if (Object.keys(fieldsToUpdate).length > 0) {
            if (fieldsToUpdate.title) {
                await redisClient.hSet(quizKey, { title: fieldsToUpdate.title })
            }
            if (fieldsToUpdate.description) {
                await redisClient.hSet(quizKey, {
                    description: fieldsToUpdate.description,
                })
            }

            console.log('Datos actualizados correctamente en Redis')
        } else {
            console.log('No hay cambios para actualizar')
        }
        if (Object.keys(fieldsToUpdate).length === 0) {
            return null
        } else return fieldsToUpdate
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
