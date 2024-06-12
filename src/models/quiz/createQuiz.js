import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const createQuiz = async (title, description, loggedUserId, accessCode) => {
  await useDb();
  const [{ insertId }] = await pool.query(
    'INSERT INTO quizzes ( title, description, owner_id, access_code)VALUES(?,?,?,?)',
    [title, description, loggedUserId, accessCode]
  );
  return insertId;
};

export default createQuiz;
