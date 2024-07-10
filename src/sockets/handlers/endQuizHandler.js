import { endQuizUtil, handleSocketErrors } from '../../utils/index.js'

const endQuizHandler = (socket, io) => {
    socket.on(
        'endQuiz',
        async (quizId, numberOfQuestions, questionsToDelete) => {
            try {
                //Se actualizan los datos en MySQL y luego se borran de Redis:
                const dataDeleted = endQuizUtil(
                    quizId,
                    socket,
                    numberOfQuestions,
                    questionsToDelete
                )

                //Una vez todo listo, emito el evento al front:
                if (dataDeleted) {
                    io.to(quizId).emit('quizEnded', {
                        message: 'Datos guardados en la base de datos',
                    })
                }
            } catch (error) {
                handleSocketErrors(error, socket)
            }
        }
    )
}
export default endQuizHandler
