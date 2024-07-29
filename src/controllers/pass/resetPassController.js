import { saveToken } from '../../models/token/index.js'
import { checkEmail } from '../../models/users/index.js'
import { generateError, sendMailUtil } from '../../utils/index.js'
import jwt from 'jsonwebtoken'

const resetPassController = async (req, res, next) => {
    try {
        const { email } = req.body
        const userDb = await checkEmail(email)
        if (!userDb) {
            generateError('No se encuentra el correo electrónico', 400)
        }

        const jwtPayload = { id: userDb.id }

        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })

        await saveToken(token, userDb.id)

        const emailSubject = 'Recupera tu contraseña'

        const bodyMail = `Copia el siguiente enlace en tu navegador para restablecer su contraseña: 
    "${process.env.FRONT_URL}/resetPassword/${token}"`

        await sendMailUtil(email, emailSubject, bodyMail)

        res.send({
            status: 'Ok',
            message: '¡Comprueba tu correo electrónico!',
        })
    } catch (error) {
        next(error)
    }
}

export default resetPassController
