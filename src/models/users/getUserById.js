import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const getUserById = async (id) => {
  await useDb();
  const [results] = await pool.query(
    `SELECT
      u.name,
      u.email,
      u.password,
      u.avatar,
      u.createdAt,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', q.id,
          'title', q.title,
          "description", q.description,
          "accessCode", q.access_code,
          'questions', (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', qu.id,
                'question', qu.question,
                "image", qu.image,
                'questionNumber', qu.question_number,
                "question_time", qu.question_time,
                'responses', JSON_OBJECT(
                  'optionA', qu.optionA,
                  'optionB', qu.optionB,
                  'optionC', qu.optionC,
                  'correctAnswer', qu.correctAnswer
                )
              )
            )
            FROM questions qu
            WHERE qu.quiz_id = q.id
          )
        )
      ) AS quizzes
    FROM users u
    LEFT JOIN quizzes q ON u.id = q.owner_id
    WHERE u.id = ?
    GROUP BY u.id;`,
    [id]
  );
  return results;
};
export default getUserById;
