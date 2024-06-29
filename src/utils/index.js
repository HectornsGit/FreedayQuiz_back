import generateError from './generateError.js'
import {
    validationSchemaRegister,
    validationSchemaLogin,
    validationSchemaQuiz,
    validationSchemaQuestions,
} from './joiValidation.js'
import { storage, limits, fileFilter } from './multerConfig.js'
import generateCode from './generateCode.js'
import handleSocketErrors from './handleSocketErrors.js'
import calculatePoints from './calculatePoints.js'

export {
    generateError,
    validationSchemaRegister,
    validationSchemaLogin,
    validationSchemaQuiz,
    validationSchemaQuestions,
    storage,
    limits,
    fileFilter,
    generateCode,
    handleSocketErrors,
    calculatePoints,
}
