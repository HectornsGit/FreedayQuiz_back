import redisClient from './redisClient.js'; //

export const storeUserResponse = (quizId, userId, questionId, answerId) => {
  const key = `quiz:${quizId}:responses`;
  const data = { userId, questionId, answerId };
  redisClient.rpush(key, JSON.stringify(data), (err) => {
    if (err) console.error('Error storing user response:', err);
  });
};

export const getUserResponses = (quizId, callback) => {
  const key = `quiz:${quizId}:responses`;
  redisClient.lrange(key, 0, -1, (err, data) => {
    if (err) return callback(err);
    const responses = data.map((item) => JSON.parse(item));
    callback(null, responses);
  });
};
