import { generateError, resizeImages } from '../../utils/index.js'
import {
    checkQuestionNumber,
    createQuestions,
} from '../../models/quiz/index.js'
import { validationSchemaQuestions } from '../../utils/index.js'

const createQuestionsController = async (req, res, next) => {
    try {
        const result = await checkQuestionNumber(
            req.body.quiz_id,
            req.body.question_number
        )

        if (result) {
            generateError(
                'Ya existe una pregunta con ese número en este quiz',
                400
            )
        }
        //Validación con Joi:
        const { error } = validationSchemaQuestions.validate(req.body)
        if (error) {
            error.message = error.details[0].message
            generateError(error.message)
        }
        let image = req.file
        if (!image) {
            image = 'imagenPredeterminadaQuestions.png'
        } else {
            image = await resizeImages(req.file, 450, 270)
        }
        const quizData = { ...req.body, image }
        await createQuestions(quizData)

        res.send({
            status: 'ok',
            message: 'Has creado las preguntas para tu quiz!👌',
            quizData,
        })
    } catch (error) {
        next(error)
    }
}

export default createQuestionsController
