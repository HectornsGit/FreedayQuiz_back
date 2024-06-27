import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

export async function getPlayersData(quizId, socket) {
    const quizKey = `quiz:${quizId}`
    const hashPattern =
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
    const results = []

    try {
        const AllData = await redisClient.hGetAll(quizKey)
        if (!AllData) {
            throw new Error(`Quiz ${quizId} not found`)
        }

        for (const item in AllData) {
            if (hashPattern.test(item)) {
                results.push(JSON.parse(AllData[item]))
            }
        }

        return results
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
