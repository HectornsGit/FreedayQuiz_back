import redisClient from '../redisClient.js'
import { generateError, handleSocketErrors } from '../../utils/index.js'
import { calculatePoints } from '../../utils/index.js'

export async function updatePlayerData(data, socket, currentQuestion) {
    try {
        const { quizId, questionId, answer, playerId, timeTaken, totalTime } =
            data
        const quizKey = `quiz:${quizId}`
        const playerData = await redisClient.hGet(quizKey, playerId)
        let points = null
        let parsedData = null
        if (playerData) {
            parsedData = JSON.parse(playerData)
            points = calculatePoints(totalTime, timeTaken, playerData.streak)
        } else {
            generateError(
                `Player data for ${playerId} not found in quiz ${quizId}`
            )
        }

        if (currentQuestion.correctAnswer === answer) {
            parsedData.totalScore += points
            parsedData.streak++
            parsedData.lastCorrectAnswer = points

            await redisClient.hSet(
                quizKey,
                playerId,
                JSON.stringify(parsedData)
            )
            console.log(
                `Updated data for player ${playerId} on quiz ${quizId}, question ${questionId}`
            )
            return parsedData
        } else {
            parsedData.streak = 0
            parsedData.lastCorrectAnswer = 0
            await redisClient.hSet(
                quizKey,
                playerId,
                JSON.stringify(parsedData)
            )
            return parsedData
        }
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
