import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';

const checkQuestionNumber = async (quizId, questionNumber) => {
  await useDb();
  const [result] = await pool.query(
    'SELECT * FROM questions WHERE quiz_id = ? AND question_number = ? ',
    [quizId, questionNumber]
  );
  console.log(result);
  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
};
export default checkQuestionNumber;
