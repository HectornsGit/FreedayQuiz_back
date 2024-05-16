import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const createQuiz = async (title, description, loggedUserId) => {
  await useDb();
  const [{ insertId }] = await pool.query(
    'INSERT INTO quizzes ( title, description, owner_id )VALUES(?,?)',
    [title, description, loggedUserId]
  );
  return insertId;
};

export default createQuiz;
