import rateLimit from 'express-rate-limit';

const joinQuizLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.',
});
export default joinQuizLimiter;
