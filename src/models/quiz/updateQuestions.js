import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
import {generateError} from "../../utils/index.js"


const updateQuestions = async (questionsData) => {
  
  try {
    await useDb();
    const {
      question,
      questionTime,
      image,
      quizId,
      optionA,
      optionB,
      optionC,
      correctAnswer,
      questionNumber,
    } = questionsData;
  
    await pool.query(
      'UPDATE questions SET question = ?, question_time = ?, optionA = ?, optionB = ?, optionC = ?, correctAnswer = ?, image = ? WHERE quiz_id = ? AND question_number = ?',
      [
        question,
        questionTime,
        optionA,
        optionB,
        optionC,
        correctAnswer,
        image,
        quizId,
        questionNumber,
      ]
    );
    console.log("Pregunta actualizada correctamente")
  } catch (error) {
    generateError(error.message)
  }
 
};

export default updateQuestions;
