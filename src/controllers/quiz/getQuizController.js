import { getQuiz } from '../../models/quiz/index.js';
const getQuizController = async (req, res, next) => {
  try {
    const logguedUserId = req.auth.id;
    const id = req.params.id;
    const userData = await getQuiz(logguedUserId, id);
    res.send(userData);
  } catch (error) {
    next(error);
  }
};
export default getQuizController;
