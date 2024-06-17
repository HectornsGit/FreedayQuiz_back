import redisClient from '../redisClient.js';
//Como argumento, recibo el quiz de la base de datos MySQL:
export async function storeQuizDataInRedis(quizData) {
  //Creo una key para el quiz:
  const quizKey = `quiz:${quizData.id}`;

  //Guardo los datos generales:
  await redisClient.hSet(quizKey, 'id', quizData.id);
  await redisClient.hSet(quizKey, 'title', quizData.title);
  await redisClient.hSet(quizKey, 'description', quizData.description);
  await redisClient.hSet(quizKey, 'owner_id', quizData.owner_id);
  await redisClient.hSet(quizKey, 'access_code', quizData.access_code);

  //Guardo las preguntas de forma separada:
  quizData.questions.forEach(async (question) => {
    await redisClient.hSet(
      quizKey,
      `question:${question.id}`,
      JSON.stringify(question)
    );
  });
}
