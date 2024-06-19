import redisClient from '../redisClient.js';
import { generateError } from '../../utils/index.js';

export async function saveInitialPlayerData(playerId, quizId, initialData) {
  const quizKey = `quiz:${quizId}`;
  try {
    await redisClient.hSet(quizKey, playerId, JSON.stringify(initialData));

    console.log(`Initial data for player ${playerId} saved for quiz ${quizId}`);
  } catch (error) {
    generateError(`Error saving initial player data: ${error.message}`);
  }
}
