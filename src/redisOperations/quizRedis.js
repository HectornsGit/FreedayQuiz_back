import { rpush, lrange } from './redisClient';

const storeUserResponse = (quizId, userId, questionId, answerId) => {
  const key = `quiz:${quizId}:responses`;
  const data = { userId, questionId, answerId };
  rpush(key, JSON.stringify(data), (err) => {
    if (err) console.error('Error storing user response:', err);
  });
};

const getUserResponses = (quizId, callback) => {
  const key = `quiz:${quizId}:responses`;
  lrange(key, 0, -1, (err, data) => {
    if (err) return callback(err);
    const responses = data.map((item) => JSON.parse(item));
    callback(null, responses);
  });
};

export { storeUserResponse, getUserResponses };
