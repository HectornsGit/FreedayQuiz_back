import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';

const updateQuestions = async (questionsData) => {
  await useDb();

  await pool.query(
    'UPDATE questions SET question = ?, question_time = ?, optionA = ?, optionB = ?, optionC = ?, correctAnswer = ?, image = ? WHERE quiz_id = ? AND question_number = ?',
    [
      questionsData.question,
      questionsData.question_time,
      questionsData.optionA,
      questionsData.optionB,
      questionsData.optionC,
      questionsData.correctAnswer,
      questionsData.image,
      questionsData.quizId,
      questionsData.question_number,
    ]
  );
};

export default updateQuestions;
