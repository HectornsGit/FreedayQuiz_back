import Joi from 'joi';

const validationSchemaRegister = {
  name: Joi.string().max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
};
const validationSchemaLogin = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
};
//Exporto las variables:
export { validationSchemaRegister, validationSchemaLogin };
