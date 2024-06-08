import useDb from '../../db/useDb.js';
import pool from '../../db/getPool.js';
const getQuiz = async (loggedUserId, id) => {
  await useDb();
  const [results] = await pool.query(
    `SELECT 
        q.id, 
        q.title,
        q.description, 
        q.owner_id, 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', qu.id,
                "quizId", qu.quiz_id,
                'question', qu.question,
                'questionNumber', qu.question_number,
                'questionTime', qu.question_time,
                'image', qu.image,
                'optionA', qu.optionA,
                'optionB', qu.optionB,
                'optionC', qu.optionC,
                'correctAnswer', qu.correctAnswer
               
                   
            )
        ) AS questions
    FROM quizzes q 
    JOIN questions qu ON q.id = qu.quiz_id 
    WHERE q.owner_id = ? AND q.id = ?
    GROUP BY q.id, q.title, q.owner_id;`,
    [loggedUserId, id]
  );

  return results[0];
};
export default getQuiz;
