import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
import generateError from '../../utils/generateError.js';

const updateQuiz = async (quizData) => {
  try {
    await useDb();
    await pool.query(
      'UPDATE quizzes SET title = ?, description = ? WHERE owner_id = ? AND id = ?',
      [quizData.title, quizData.description, quizData.ownerId, quizData.id]
    );
    console.log('Quiz actualizado correctamente');
  } catch (error) {
    generateError(error.message);
  }
};

export default updateQuiz;
