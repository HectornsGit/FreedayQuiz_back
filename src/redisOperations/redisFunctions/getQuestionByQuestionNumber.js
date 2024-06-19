import generateError from '../../utils/generateError.js';
import redisClient from '../redisClient.js';

export async function getQuestionByQuestionNumber(quizId, questionNumber) {
  try {
    const questionKey = `quiz:${quizId}:question:${questionNumber}`;
    const retrievedQuestion = await redisClient.get(questionKey);

    if (!retrievedQuestion) {
      generateError(
        `Question number ${questionNumber} not found for quiz ${quizId}`,
        404
      );
    }

    const questionObject = JSON.parse(retrievedQuestion);
    return questionObject;
  } catch (error) {
    generateError(
      `An error occurred while fetching question number ${questionNumber} for quiz ${quizId}: ${error.message}`
    );
  }
}
