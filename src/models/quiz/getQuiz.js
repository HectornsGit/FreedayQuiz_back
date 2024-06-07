import useDb from '../../db/useDb.js';
import pool from '../../db/getPool.js';
const getQuiz = async (loggedUserId, title) => {
  await useDb();
  const [results] = await pool.query(
    'SELECT q.*, qu.* FROM quizzes q JOIN questions qu ON q.id = qu.quiz_id WHERE q.owner_id = ? AND q.title = ?;',
    [loggedUserId, title]
  );
  return results;
};
export default getQuiz;
