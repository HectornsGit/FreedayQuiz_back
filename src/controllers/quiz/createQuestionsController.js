import { generateError } from '../../utils/index.js'
import {
    checkQuestionNumber,
    createQuestions,
} from '../../models/quiz/index.js'
import { validationSchemaQuestions } from '../../utils/index.js'
import { PassThrough } from 'stream'
import { cloudinary } from '../../utils/index.js'

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

        let image

        if (!req.file) {
            image = process.env.DEFAULT_IMAGE_QUESTION
        } else {
            image = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'quiz_questions', // Carpeta en Cloudinary
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

        const quizData = { ...req.body, image }
        const insertId = await createQuestions(quizData)

        res.send({
            status: 'ok',
            message: 'Has creado las preguntas para tu quiz!👌',
            quizData: { ...quizData, id: insertId },
        })
    } catch (error) {
        next(error)
    }
}

export default createQuestionsController
