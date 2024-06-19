import redisClient from '../redisClient.js';

export async function getQuestionByQuestionNumber(quizId, questionNumber) {
  try {
    const questionKey = `quiz:${quizId}:question:${questionNumber}`;
    const retrievedQuestion = await redisClient.get(questionKey);

    if (!retrievedQuestion) {
      return {
        error: `Question number ${questionNumber} not found for quiz ${quizId}`,
      };
    }

    const questionObject = JSON.parse(retrievedQuestion);
    return questionObject;
  } catch (error) {
    return {
      error: `An error occurred while fetching question number ${questionNumber} for quiz ${quizId}: ${error.message}`,
    };
  }
}
