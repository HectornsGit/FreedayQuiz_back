import { getQuiz, updateQuestions } from '../../models/quiz/index.js'
import { generateError, validationSchemaQuestions } from '../../utils/index.js'
import { PassThrough } from 'stream'
import { cloudinary } from '../../utils/index.js'

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

        if (req.file) {
            const defaultImageUrl = process.env.DEFAULT_IMAGE_QUESTION

            if (image !== defaultImageUrl) {
                const publicId = image.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(publicId) // Elimina la imagen antigua de Cloudinary
            }

            // Subir la nueva imagen a Cloudinary
            image = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'quiz_questions',
                        transformation: {
                            width: 450,
                            height: 270,
                            crop: 'fill',
                        },
                    },
                    (error, result) => {
                        if (error) {
                            return reject(
                                new Error(
                                    'Error al subir la imagen a Cloudinary'
                                )
                            )
                        }
                        resolve(result.secure_url)
                    }
                )

                const bufferStream = new PassThrough()
                bufferStream.end(req.file.buffer)
                bufferStream.pipe(uploadStream)
            })
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
