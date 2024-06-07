import { getQuiz } from '../../models/quiz/index.js';
const getUserByIdController = async (req, res, next) => {
  try {
    const logguedUserId = req.auth.id;
    const title = req.params.title;
    const userData = await getQuiz(logguedUserId, title);
    res.send(userData);
  } catch (error) {
    next(error);
  }
};
export default getUserByIdController;
