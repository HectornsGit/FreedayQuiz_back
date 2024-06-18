import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const deleteQuestion = async (questionId, quizId) => {
  await useDb();
  await pool.query(`DELETE FROM questions WHERE quiz_id =? AND id = ?`, [
    quizId,
    questionId,
  ]);
};
export default deleteQuestion;
