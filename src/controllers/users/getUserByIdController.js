import { getUserById } from '../../models/users/index.js';
const getUserByIdController = async (req, res, next) => {
  try {
    const logguedUserId = req.auth.id;
    const userData = await getUserById(logguedUserId);
    res.send(userData);
  } catch (error) {
    next(error);
  }
};
export default getUserByIdController;
