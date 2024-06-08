import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';

const updateQuiz = async (quizData) => {
  await useDb();

  await pool.query(
    'UPDATE quizzes SET title = ?, description = ? WHERE owner_id = ? AND id = ?',
    [quizData.title, quizData.description, quizData.ownerId, quizData.id]
  );
};

export default updateQuiz;
