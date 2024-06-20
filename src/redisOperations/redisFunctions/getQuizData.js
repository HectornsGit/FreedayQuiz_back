import redisClient from '../redisClient.js';
import { generateError } from '../../utils/index.js';

export async function getQuizData(quizId) {
  const quizKey = `quiz:${quizId}`;
  try {
    const currentData = await redisClient.hGetAll(quizKey);
    if (!currentData) {
      generateError(`Quiz ${quizId} not found`);
      return null;
    }

    return currentData;
  } catch (error) {
    generateError(
      `An error occurred while getting quiz data: ${error.message}`
    );
  }
}
