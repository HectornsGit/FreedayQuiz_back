import useDb from '../../db/useDb.js';
import pool from '../../db/getPool.js';
const GetQuizIdByAccessCode = async (accessCode) => {
  await useDb();
  const [id] = await pool.query(`SELECT id FROM quizzes WHERE access_code =?`, [
    accessCode,
  ]);
  return id[0].id;
};
export default GetQuizIdByAccessCode;
