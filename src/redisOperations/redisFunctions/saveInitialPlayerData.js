import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function saveInitialPlayerData(
    playerId,
    quizId,
    initialData,
    socket
) {
    const quizKey = `quiz:${quizId}`
    try {
        //Aquí se guarda la key de quiz (quizKey) que guardará todos los datos del quiz. Luego, el hash del jugador en concreto (que en este caso es el id) y luego el dato, en este caso, conjunto de datos, asociados al hash:
        await redisClient.hSet(quizKey, playerId, JSON.stringify(initialData))

        console.log(
            `Initial data for player ${playerId} saved for quiz ${quizId}`
        )
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
