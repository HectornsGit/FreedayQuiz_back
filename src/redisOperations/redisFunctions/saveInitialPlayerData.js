import redisClient from '../redisClient.js';

export async function saveInitialPlayerData(playerId, quizId, initialData) {
  const quizKey = `quiz:${quizId}`;
  try {
    await redisClient.hSet(quizKey, playerId, JSON.stringify(initialData));

    console.log(`Initial data for player ${playerId} saved for quiz ${quizId}`);
  } catch (error) {
    console.error(`Error saving initial player data: ${error.message}`);
  }
}
