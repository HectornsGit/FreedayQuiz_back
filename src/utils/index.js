import generateError from './generateError.js'
import {
    validationSchemaRegister,
    validationSchemaLogin,
    validationSchemaQuiz,
    validationSchemaQuestions,
    validationSchemaResetPassword,
} from './joiValidation.js'
import { storage, bufferStorage, limits, fileFilter } from './multerConfig.js'
import generateCode from './generateCode.js'
import handleSocketErrors from './handleSocketErrors.js'
import calculatePoints from './calculatePoints.js'
import endQuizUtil from './endQuizUtil.js'
import sendMailUtil from './sendMailUtil.js'
import resizeImages from './resizeImages.js'
import cloudinary from './cloudinaryConfig.js'
import generateRandomAvatar from './generateRandomAvatar.js'

export {
    generateError,
    validationSchemaRegister,
    validationSchemaLogin,
    validationSchemaQuiz,
    validationSchemaQuestions,
    validationSchemaResetPassword,
    storage,
    bufferStorage,
    limits,
    fileFilter,
    generateCode,
    handleSocketErrors,
    calculatePoints,
    endQuizUtil,
    sendMailUtil,
    resizeImages,
    cloudinary,
    generateRandomAvatar,
}
