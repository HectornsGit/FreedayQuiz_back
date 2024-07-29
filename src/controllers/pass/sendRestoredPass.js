import { getToken, deleteToken } from '../../models/token/index.js'
import { updatePassword } from '../../models/users/index.js'
import { generateError } from '../../utils/index.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationSchemaResetPassword } from '../../utils/index.js'

const sendRestoredPass = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body

        const { error } = validationSchemaResetPassword.validate({
            password: newPassword,
        })

        if (error) {
            error.message = error.details[0].message
            generateError(error.message)
        }

        if (!token) {
            generateError('El token no ha sido proporcionado', 400)
        }

        //Compruebo que el token se ha hecho con la clave secreta:
        let tokenPayload
        try {
            tokenPayload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            generateError('El token es inválido', 400)
        }
        const userIdFromToken = tokenPayload.id

        //Compruebo que el token existe en la base de datos y está asociado al id del usuario que lo envía:
        const id = await getToken(userIdFromToken, token)
        if (userIdFromToken !== id) {
            generateError('¡Los id no coinciden!')
        }

        await deleteToken(id)

        //Actualizo la contraseña del usuario en la base de datos:
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const { affectedRows, changedRows } = await updatePassword(
            hashedPassword,
            id
        )

        if (changedRows < 1) {
            generateError('Error guardando la nueva contraseña', 400)
        }

        res.send({
            status: 'Ok',
            message: '¡Contraseña cambiada!',
            id: id,
        })
    } catch (error) {
        next(error)
    }
}

export default sendRestoredPass
