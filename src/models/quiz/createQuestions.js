import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const createQuestions = async (quizData) => {
  const {
    quiz_id,
    title,
    optionA,
    optionB,
    optionC,
    correctAnswer,
    question_number,
  } = quizData;

  await useDb();

  await pool.query(
    'INSERT INTO questions ( quiz_id, title, optionA, optionB,optionC, correctAnswer, question_number )VALUES(?,?,?,?,?,?,?)',
    [quiz_id, title, optionA, optionB, optionC, correctAnswer, question_number]
  );
};
export default createQuestions;
