import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const deleteQuestion = async (questionIds, quizId) => {
  await useDb();

  //Elimino las preguntas:
  await pool.query(`DELETE FROM questions WHERE quiz_id = ? AND id IN (?)`, [
    quizId,
    questionIds,
  ]);

  // Traigo los ids de las preguntas restantes correspondientes al quiz, pero ordenadas por question_number:
  const [remainingQuestions] = await pool.query(
    'SELECT id FROM questions WHERE quiz_id = ? ORDER BY question_number',
    [quizId]
  );

  //Actualizo los question_number por orden:
  for (let i = 0; i < remainingQuestions.length; i++) {
    const questionId = remainingQuestions[i].id;
    const questionNumber = i + 1;

    await pool.query('UPDATE questions SET question_number = ? WHERE id = ?', [
      questionNumber,
      questionId,
    ]);
  }
};
export default deleteQuestion;
