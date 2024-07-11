import { handleSocketErrors } from '../../utils/index.js'
import redisClient from '../redisClient.js'

export async function getQuestionByQuestionNumber(
    quizId,
    questionNumber,
    socket,
    numberOfQuestions = 0,
    direccion = ''
) {
    try {
        const questionKey = `quiz:${quizId}:question:${questionNumber}`
        const retrievedQuestion = await redisClient.get(questionKey)
        const questionObject = JSON.parse(retrievedQuestion)

        //Esta lógica es debida a que, al borrar una pregunta, los question_number restantes dejarán de ser consecutivos y la lógica para traer la siguiente pregunta al master, o la previa, fallará. De este modo, avanzará o retrodecerá hasta encontrar la siguiente disponible. Esto es posible porque el numberOfQuestion inicial no se alterará en ningún momento del quiz.
        if (!questionObject) {
            if (direccion === 'forward') {
                for (let i = 1; i <= numberOfQuestions; i++) {
                    const questionKey = `quiz:${quizId}:question:${
                        questionNumber + i
                    }`
                    const retrievedQuestion = await redisClient.get(questionKey)
                    const questionObject = JSON.parse(retrievedQuestion)
                    if (questionObject) {
                        return questionObject
                    }
                }
            } else {
                let backwardSequence = questionNumber - 1
                for (let i = numberOfQuestions; i >= 1; i--) {
                    const questionKey = `quiz:${quizId}:question:${backwardSequence}`
                    const retrievedQuestion = await redisClient.get(questionKey)
                    const questionObject = JSON.parse(retrievedQuestion)
                    backwardSequence--
                    if (questionObject) {
                        return questionObject
                    }
                }
            }
        }
        return questionObject
    } catch (error) {
        handleSocketErrors(error, socket)
    }
}
