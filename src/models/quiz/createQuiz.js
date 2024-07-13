import pool from '../../db/getPool.js'
import useDb from '../../db/useDb.js'
const createQuiz = async (title, description, loggedUserId, accessCode) => {
    await useDb()
    await pool.query(
        'INSERT INTO quizzes ( title, description, owner_id, access_code)VALUES(?,?,?,?)',
        [title, description, loggedUserId, accessCode]
    )
    const [id] = await pool.query(
        `SELECT id from quizzes WHERE access_code = (?)`,
        [accessCode]
    )
    return id
}

export default createQuiz
