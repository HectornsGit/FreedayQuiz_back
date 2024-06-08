import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';

const updateQuestions = async (questionsData) => {
  await useDb();
  const {
    question,
    questionTime,
    image,
    quizId,
    optionA,
    optionB,
    optionC,
    correctAnswer,
    questionNumber,
  } = questionsData;

  await pool.query(
    'UPDATE questions SET question = ?, question_time = ?, optionA = ?, optionB = ?, optionC = ?, correctAnswer = ?, image = ? WHERE quiz_id = ? AND question_number = ?',
    [
      question,
      questionTime,
      optionA,
      optionB,
      optionC,
      correctAnswer,
      image,
      quizId,
      questionNumber,
    ]
  );
};

export default updateQuestions;
