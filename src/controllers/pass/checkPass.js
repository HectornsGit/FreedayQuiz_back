import deleteToken from '../../models/token/deleteToken.js'
import getToken from '../../models/token/getToken.js'
import { generateError } from '../../utils/index.js'
import jwt from 'jsonwebtoken'

const checkPass = async (req, res, next) => {
    try {
        const tokenFromBack = req.params.token

        if (!tokenFromBack) {
            return generateError('El token no ha sido proporcionado', 400)
        }

        //Compruebo que el token se ha hecho con la clave secreta:
        let tokenPayload
        try {
            tokenPayload = jwt.verify(tokenFromBack, process.env.JWT_SECRET)
        } catch (error) {
            generateError('El token es inválido', 400)
        }
        const userIdFromToken = tokenPayload.id

        //Compruebo que el token existe en la base de datos y está asociado al id del usuario que lo envía:
        const id = await getToken(userIdFromToken, tokenFromBack)
        if (userIdFromToken !== id) {
            generateError('¡Los id no coinciden!')
        }

        res.send({
            status: 'Ok',
            message: '¡Token Verificado!',
            id: id,
        })
    } catch (error) {
        next(error)
    }
}

export default checkPass
