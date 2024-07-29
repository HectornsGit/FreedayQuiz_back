import Joi from 'joi'

const validationSchemaRegister = Joi.object({
    name: Joi.string().max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

const validationSchemaLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})
const validationSchemaResetPassword = Joi.object({
    password: Joi.string().min(6).required(),
})
const validationSchemaQuiz = Joi.object({
    title: Joi.string().max(40).required(),
    description: Joi.string().min(6).max(200).required(),
})
const validationSchemaQuestions = Joi.object({
    quiz_id: Joi.string().max(60).required(),
    question: Joi.string().max(60).required(),
    question_time: Joi.string().max(60).required(),
    optionA: Joi.string().max(60).required(),
    optionB: Joi.string().max(60).required(),
    optionC: Joi.string().max(60).required(),
    correctAnswer: Joi.string().max(60).required(),
    question_number: Joi.number().required(),
})
//Exporto las variables:
export {
    validationSchemaRegister,
    validationSchemaLogin,
    validationSchemaQuiz,
    validationSchemaQuestions,
    validationSchemaResetPassword,
}
