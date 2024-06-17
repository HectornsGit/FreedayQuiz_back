import redisClient from '../redisClient.js';
export async function updatePlayerData(quizId, questionId, playerId, points) {
  console.log(playerId);
  const quizKey = `quiz:${quizId}`;
  try {
    const playerData = await redisClient.hGet(quizKey, playerId);

    if (playerData) {
      const parsedData = JSON.parse(playerData);
      parsedData.totalScore += points;

      await redisClient.hSet(quizKey, playerId, JSON.stringify(parsedData));
      console.log(
        `Updated data for player ${playerId} on quiz ${quizId}, question ${questionId}`
      );

      return parsedData;
    } else {
      console.error(`Player data for ${playerId} not found in quiz ${quizId}`);
    }
  } catch (error) {
    console.error(`Error updating player data: ${error.message}`);
  }
}
