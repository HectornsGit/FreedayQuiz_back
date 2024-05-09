import checkEmail from '../../models/users/checkEmail';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import generateError from '../../utils/index.js';
import { validationSchemaRegister } from '../../utils/validation.js';
import checkEmail from '../../models/users/checkEmail';
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const validationObject = {
      name,
      email,
      password,
    };
    const { error } = Joi.object(validationSchemaRegister).validate(
      validationObject
    );

    if (error) {
      error.message = error.details[0].message;
      throw error;
    }

    const emailFromDb = await checkEmail(email);

    if (emailFromDb) {
      generateError('Ya existe un usuario con este email', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertId = await createUser(name, email, hashedPassword);

    res.status(201).send({
      message: 'Registro completado con éxito',
      data: { id: insertId, name, email, password },
    });
  } catch (error) {
    next(error);
  }
};
export default register;
