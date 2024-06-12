import useDb from '../../db/useDb.js';
import pool from '../../db/getPool.js';

const getQuiz = async (loggedUserId, id) => {
  await useDb();

  const [rows] = await pool.query(
    `SELECT 
        q.id AS quizId, 
        q.title,
        q.description, 
        q.owner_id AS ownerId,
        q.access_code AS accessCode,
        qu.id AS questionId,
        qu.question,
        qu.question_number AS questionNumber,
        qu.question_time AS questionTime,
        qu.image,
        qu.optionA,
        qu.optionB,
        qu.optionC,
        qu.correctAnswer
    FROM quizzes q 
    LEFT JOIN questions qu ON q.id = qu.quiz_id 
    WHERE q.owner_id = ? AND q.id = ?
    ORDER BY qu.question_number;`,
    [loggedUserId, id]
  );

  if (rows.length === 0) {
    return null;
  }

  const quiz = {
    id: rows[0].quizId,
    title: rows[0].title,
    description: rows[0].description,
    owner_id: rows[0].ownerId,
    access_code: rows[0].accessCode,
    questions: rows
      .filter((row) => row.questionId !== null)
      .map((row) => ({
        id: row.questionId,
        quizId: row.quizId,
        question: row.question,
        questionNumber: row.questionNumber,
        questionTime: row.questionTime,
        image: row.image,
        optionA: row.optionA,
        optionB: row.optionB,
        optionC: row.optionC,
        correctAnswer: row.correctAnswer,
      })),
  };

  return quiz;
};

export default getQuiz;
