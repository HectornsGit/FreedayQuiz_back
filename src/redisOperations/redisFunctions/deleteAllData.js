import redisClient from '../redisClient.js';

export async function deleteAllData(quizId) {
  try {
    // Obtengo todas las claves relacionadas con el quizId
    const keys = await redisClient.keys(`quiz:${quizId}*`);

    if (keys.length > 0) {
      // Luego elimino todas las claves encontradas
      await redisClient.del(keys);
      console.log(`Deleted ${keys.length} keys for quiz ${quizId}`);
    } else {
      console.log(`No keys found for quiz ${quizId}`);
    }
  } catch (error) {
    console.error(`Error deleting data for quiz ${quizId}: ${error.message}`);
  }
}
