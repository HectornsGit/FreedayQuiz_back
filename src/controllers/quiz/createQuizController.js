import { createQuiz } from '../../models/quiz/index.js';
import { validationSchemaQuiz } from '../../utils/index.js';
import qr from 'qrcode';

const createQuizController = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const loggedUserId = req.auth?.id;

    //Validación con Joi:
    const { error } = validationSchemaQuiz.validate(req.body);
    if (error) {
      error.message = error.details[0].message;
      throw error;
    }
    //Generación de código de acceso aleatorio:
    function generateCode() {
      return Math.floor(1000 + Math.random() * 9000).toString();
    }
    const accessCode = generateCode();
    //----------------------------
    const insertId = await createQuiz(
      title,
      description,
      loggedUserId,
      accessCode
    );

    //Creación de código QR:
    const quizURL = await qr.toDataURL(
      `${process.env.FRONT_URL}/quiz/${insertId}`
    );

    res.send({
      status: 'ok',
      message: 'Has creado un quiz!👌',
      data: {
        id: insertId,
        title,
        description,
        accessCode,
        ownerId: loggedUserId,
        qrCode: {
          quizId: insertId,
          url: quizURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default createQuizController;
