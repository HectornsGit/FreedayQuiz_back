import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';

const updateQuizAndQuestions = async (quizData) => {
  await useDb();
  const connection = await pool.getConnection();

  try {
    // Esto es para asegurarnos de que, si hay algún error, no se actualizará una tabla sí y la otra no.
    await connection.beginTransaction();

    await connection.query(
      'UPDATE quizzes SET title = ?, description = ? WHERE owner_id = ? AND id = ?',
      [quizData.title, quizData.description, quizData.ownerId, quizData.id]
    );

    await connection.query(
      'UPDATE questions SET question = ?, question_time = ?, optionA = ?, optionB = ?, optionC = ?, correctAnswer = ?, question_number = ?, image = ? WHERE quiz_id = ?',
      [
        quizData.question,
        quizData.question_time,
        quizData.optionA,
        quizData.optionB,
        quizData.optionC,
        quizData.correctAnswer,
        quizData.question_number,
        quizData.image,
        quizData.id,
      ]
    );

    await connection.commit();
  } catch (error) {
    // Si hay algún error, revertimos la transacción
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default updateQuizAndQuestions;
