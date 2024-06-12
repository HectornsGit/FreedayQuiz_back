import useDb from '../../db/useDb.js';
import pool from '../../db/getPool.js';
const GetQuizIdByAccessCode = async (accessCode) => {
  useDb();
  const quizId = pool.query(`SELECT id FROM quizzes WHERE access_code =?`, [
    accessCode,
  ]);
  return quizId;
};
export default GetQuizIdByAccessCode;
