import { GetQuizIdByAccessCode } from '../../models/quiz/index.js';

const getQuizIdByAccessCodeController = async (req, res) => {
  //Se trae el codigo de los parámetros:
  const accessCode = req.params.access_code;

  //Se valida que el código tenga el formato correcto:
  if (!/^[a-zA-Z0-9]{4}$/.test(accessCode)) {
    return res.status(400).send('Invalid access code format');
  }
  //Se trae el id del quiz:
  const quizId = await GetQuizIdByAccessCode(accessCode);

  //Se devuelve el id del quiz al frontend:
  res.send({ status: 'ok', quizId: quizId });
};

export default getQuizIdByAccessCodeController;
