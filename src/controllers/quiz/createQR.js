import { generateError } from '../../utils/index.js'
import qr from 'qrcode'

const createQR = async (req, res, next) => {
    try {
        const quizId = req.params.quizId
        if (!quizId) {
            generateError('Quiz ID is required')
        }
        //Creación de código QR:
        const quizURL = await qr.toDataURL(
            `${process.env.FRONT_URL}/quiz/${quizId}`
        )
        res.send({
            status: 'ok',
            message: 'Código QR generado con éxito',
            qrCode: {
                quizId: quizId,
                url: quizURL,
            },
        })
    } catch (error) {
        next(error)
    }
}

export default createQR
