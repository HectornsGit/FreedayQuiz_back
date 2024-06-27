import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'
import { generateError } from '../../utils/index.js'

export async function deleteAllData(quizId, socket) {
    try {
        // Obtengo todas las claves relacionadas con el quizId
        const keys = await redisClient.keys(`quiz:${quizId}*`)

        if (keys.length > 0) {
            // Luego elimino todas las claves encontradas
            await redisClient.del(keys)
            console.log(`Deleted ${keys.length} keys for quiz ${quizId}`)
        } else {
            generateError(`No keys found for quiz ${quizId}`, 404)
        }
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
