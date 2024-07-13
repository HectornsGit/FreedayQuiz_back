import redisClient from '../redisClient.js'
import { handleSocketErrors } from '../../utils/index.js'

const clickedResponses = async (quizId, responses) => {
    const quizKey = `quiz:${quizId}`
    try {
        await redisClient.hSet(
            quizKey,
            'clicked responses',
            JSON.stringify(responses)
        )

        console.log(`Clicked responses updated for quiz ${quizId}`)
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
export default clickedResponses
