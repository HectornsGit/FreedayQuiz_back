import jwt from 'jsonwebtoken'
import { generateError } from '../utils/index.js'

const validateAuth = (req, _res, next) => {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            generateError('Se requiere autorización', 401)
        }

        const [tokenType, token] = authorization.split(' ')

        if (tokenType !== 'Bearer') {
            generateError("El token debe ser de tipo 'Bearer'", 400)
        }

        let tokenPayload

        try {
            tokenPayload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            generateError('El token es inválido', 400)
        }

        req.auth = tokenPayload

        next()
    } catch (error) {
        next(error)
    }
}

export default validateAuth
