import { generateError } from '../../utils/index.js'
import redisClient from '../redisClient.js'

const setOnlineState = async (quizId, playerId, state) => {
    const quizKey = `quiz:${quizId}`
    try {
        const playerData = await redisClient.hGet(quizKey, playerId)

        if (playerData) {
            const parsedData = JSON.parse(playerData)
            parsedData.state = state
            await redisClient.hSet(
                quizKey,
                playerId,
                JSON.stringify(parsedData)
            )

            console.log(
                `Updated state for player ${playerId} on quiz ${quizId}`
            )
        } else {
            generateError(
                `SetOnline: Player data for ${playerId} not found in quiz ${quizId}`
            )
        }
    } catch (error) {
        console.log(error.message)
    }
}
export default setOnlineState
