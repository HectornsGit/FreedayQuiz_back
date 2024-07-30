import { deleteQuiz } from '../../models/quiz/index.js'
const deleteQuizController = async (req, res, next) => {
    const logguedUserId = req.auth.id
    const quizId = req.params.id
    try {
        await deleteQuiz(quizId, logguedUserId)
        res.status(200).send({ message: `Quiz con id ${quizId},borrado` })
    } catch (error) {
        console.log('Error al borrar el quiz', error)
        next(error)
    }
}
export default deleteQuizController
