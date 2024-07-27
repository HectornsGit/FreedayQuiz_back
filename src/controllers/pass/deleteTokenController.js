import { deleteToken } from '../../models/token/index.js'
const deleteTokenController = (req, res, next) => {
    try {
        const id = req.body.id
        deleteToken(id)
    } catch (error) {
        next(error)
    }
}
export default deleteTokenController
