import Joi from 'joi';

const validationSchemaRegister = {
  name: Joi.string().max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  biography: Joi.string().min(10).max(255),
};

//Exporto las variables:
export { validationSchemaRegister };
