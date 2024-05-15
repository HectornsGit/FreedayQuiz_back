import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const createQuiz = async (title, description) => {
  await useDb();
  const [{ insertId }] = await pool.query(
    'INSERT INTO quizzes ( title, description )VALUES(?,?)',
    [title, description]
  );
  return insertId;
};

export default createQuiz;
