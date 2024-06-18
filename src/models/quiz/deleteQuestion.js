import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const deleteQuestion = async (questionId, quizId) => {
  await useDb();

  //Selecciono el número de pregunta que voy a eliminar y la guardo en una variable:
  const [questionToDelete] = await pool.query(
    'SELECT question_number FROM questions  WHERE id =?',
    [questionId]
  );
  const questionNumber = questionToDelete[0].question_number;
  console.log('questionNumner', questionNumber);

  //Elimino la pregunta:
  await pool.query(`DELETE FROM questions WHERE quiz_id =? AND id = ?`, [
    quizId,
    questionId,
  ]);

  // Actualizo los question_number de las preguntas restantes
  await pool.query(
    'UPDATE questions SET question_number = question_number - 1 WHERE question_number > ?',
    [questionNumber]
  );
};
export default deleteQuestion;
