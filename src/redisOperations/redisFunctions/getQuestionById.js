import redisClient from '../redisClient.js';
export async function getQuestionById(quizId, questionId) {
  const quizKey = `quiz:${quizId}`;

  const retrievedQuestion = await redisClient.hGet(
    quizKey,
    `question:${questionId}`
  );

  const questionObject = JSON.parse(retrievedQuestion);

  if (!questionObject) {
    return {
      error: `Question with id ${questionId} not found for quiz ${quizId}`,
    };
  }

  return questionObject;
}
