import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const deleteQuiz = async (quizId) => {
  await useDb();
  await pool.query(`DELETE FROM questions WHERE quiz_id =?`, [quizId]);
  await pool.query(`DELETE FROM quizzes WHERE id =?`, [quizId]);
};
export default deleteQuiz;
