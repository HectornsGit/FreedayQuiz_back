import redisClient from '../redisClient.js';
import { generateError } from '../../utils/index.js';

export async function updateQuizData(quizData) {
  const quizKey = `quiz:${quizData.id}`;
  try {
    // Obtener los datos actuales del quiz en Redis
    const currentData = await redisClient.hGetAll(quizKey);

    // Preparo los campos que se van a actualizar
    const fieldsToUpdate = {};
    if (currentData.title !== quizData.title)
      fieldsToUpdate.title = quizData.title;
    if (currentData.description !== quizData.description)
      fieldsToUpdate.description = quizData.description;

    // Si hay campos para actualizar, hacer la actualización en Redis
    if (Object.keys(fieldsToUpdate).length > 0) {
      await redisClient.hSet(quizKey, fieldsToUpdate);
      console.log('Datos actualizados correctamente en Redis');
    } else {
      console.log('No hay cambios para actualizar');
    }
  } catch (error) {
    generateError(
      `An error occurred while saving or updating quiz data: ${error.message}`
    );
  }
}
