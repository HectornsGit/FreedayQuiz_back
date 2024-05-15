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
const validationSchemaQuiz = {
  title: Joi.string().max(40).required(),
  description: Joi.string().min(6).max(200).required(),
};
const validationSchemaQuestions = {
  quiz_id: Joi.number().integer().required(),
  title: Joi.string().max(60).required(),
  optionA: Joi.string().max(60).required(),
  optionB: Joi.string().max(60).required(),
  optionC: Joi.string().max(60).required(),
  optionD: Joi.string().max(60).required(),
  question_number: Joi.number().required(),
};
//Exporto las variables:
export {
  validationSchemaRegister,
  validationSchemaLogin,
  validationSchemaQuiz,
  validationSchemaQuestions,
};
