import path from 'path'
import fs from 'fs/promises'
import { getQuiz, updateQuestions } from '../../models/quiz/index.js'
import {
    generateError,
    resizeImages,
    validationSchemaQuestions,
} from '../../utils/index.js'

const updateQuestionController = async (req, res, next) => {
    try {
        const loggedUserId = req.auth.id

        const quizFromDb = await getQuiz(loggedUserId, req.params.quiz_id)

        const questionFromDb = quizFromDb.questions.find((question) => {
            return (
                question.quizId === req.params.quiz_id &&
                question.questionNumber === +req.params.question_number
            )
        })

        let questionToUpdate = {
            ...questionFromDb,
            ...req.body,
            ...{ ownerId: loggedUserId },
        }

        let image = questionToUpdate.image
        //Si envías una nueva foto, se borra la anterior de la carpeta uploads:
        if (req.file) {
            const oldImagePath = path.join(
                'src',
                'uploads',
                questionFromDb.image
            )
            const newImagePath = path.join(
                'src',
                'uploads',
                `resized-${req.file.originalname}`
            )

            try {
                // Si la imagen actual es diferente a la predeterminada, se elimina la anterior:
                if (
                    newImagePath &&
                    newImagePath !== oldImagePath &&
                    oldImagePath != 'imagenPredeterminadaQuestions.png'
                ) {
                    image = await resizeImages(req.file, 450, 270)
                    await fs.unlink(oldImagePath)
                }
            } catch (error) {
                console.error(
                    'Error al acceder o eliminar la imagen actual:',
                    error.message
                )
            }
        }

        const {
            question,
            question_time,
            optionA,
            optionB,
            optionC,
            correctAnswer,
            question_number,
        } = questionToUpdate

        //Validación con Joi:
        const validationQuestionObject = {
            quiz_id: req.params.quiz_id,
            question,
            question_time,
            optionA,
            optionB,
            optionC,
            correctAnswer,
            question_number,
        }

        const { QuestionsError } = validationSchemaQuestions.validate(
            validationQuestionObject
        )

        if (QuestionsError) {
            error.message = error.details[0].message
            generateError(error.message)
        }

        questionToUpdate = {
            ...questionToUpdate,
            ...{ image: image },
        }

        await updateQuestions(questionToUpdate)
        res.send({
            status: 'Ok',
            data: {
                message: 'Datos actualizados correctamente',
                questionUpdated: questionToUpdate,
            },
        })
    } catch (error) {
        next(error)
    }
}

export default updateQuestionController
