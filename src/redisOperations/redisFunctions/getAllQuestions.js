import generateError from '../../utils/generateError.js';
import redisClient from '../redisClient.js';

export async function getAllQuestions(quizId, numberOfQuestions) {
  try {
    const questions = [];

    for (let i = 1; i <= numberOfQuestions; i++) {
      const questionKey = `quiz:${quizId}:question:${i}`;
      const question = await redisClient.get(questionKey);
      if (question) {
        questions.push(JSON.parse(question));
      }
    }

    return questions;
  } catch (error) {
    generateError(
      `An error occurred while fetching questions for quiz ${quizId}: ${error.message}`
    );
  }
}
