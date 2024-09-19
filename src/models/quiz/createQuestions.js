import pool from '../../db/getPool.js'
import useDb from '../../db/useDb.js'
const createQuestions = async (quizData) => {
    const {
        quiz_id,
        question,
        question_time,
        optionA,
        optionB,
        optionC,
        correctAnswer,
        question_number,
        image,
    } = quizData

    await useDb()

    const insertId = await pool.query(
        'INSERT INTO questions ( quiz_id, question,  question_number, optionA, optionB, optionC, correctAnswer, question_time, image )VALUES(?,?,?,?,?,?,?,?,?)',
        [
            quiz_id,
            question,
            question_number,
            optionA,
            optionB,
            optionC,
            correctAnswer,
            question_time,
            image,
        ]
    )
    return insertId[0].insertId
}
export default createQuestions
