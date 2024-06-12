import { GetQuizIdByAccessCode } from '../../models/quiz/index.js';

const getQuizIdByAccessCodeController = async (req, res) => {
  const accessCode = req.params.access_code;

  if (!/^[a-zA-Z0-9]{4}$/.test(accessCode)) {
    return res.status(400).send('Invalid access code format');
  }
  const quizId = await GetQuizIdByAccessCode(accessCode);
  res.send(quizId);
};

export default getQuizIdByAccessCodeController;
