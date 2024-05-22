import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const createQuestions = async (quizData) => {
  const {
    quiz_id,
    question,
    optionA,
    optionB,
    optionC,
    correctAnswer,
    question_number,
    image,
  } = quizData;

  await useDb();

  await pool.query(
    'INSERT INTO questions ( quiz_id, question, optionA, optionB,optionC, correctAnswer, question_number, image )VALUES(?,?,?,?,?,?,?,?)',
    [
      quiz_id,
      question,
      optionA,
      optionB,
      optionC,
      correctAnswer,
      question_number,
      image,
    ]
  );
};
export default createQuestions;
