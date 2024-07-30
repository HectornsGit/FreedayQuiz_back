import bcrypt from 'bcrypt'
import { generateError } from '../../utils/index.js'
import { validationSchemaRegister, resizeImages } from '../../utils/index.js'
import { checkEmail, createUser } from '../../models/users/index.js'

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        console.log('nombre de la foto', req.file)
        // Lógica para tratar las imágenes:
        let avatar = req.file
        if (!avatar) {
            avatar = 'imagenPredeterminada.png'
        } else {
            avatar = await resizeImages(req.file, 150, 150)
        }

        //Validación de los datos con Joi:
        const validationObject = {
            name,
            email,
            password,
        }
        const { error } = validationSchemaRegister.validate(validationObject)

        if (error) {
            error.message = error.details[0].message
            generateError(error.message)
        }

        const emailFromDb = await checkEmail(email)

        if (emailFromDb) {
            generateError('Ya existe un usuario con este email', 400)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const insertId = await createUser(name, email, hashedPassword, avatar)

        res.status(201).send({
            message: 'Registro completado con éxito',
            data: { id: insertId, name: name, email: email, avatar: avatar },
        })
    } catch (error) {
        next(error)
    }
}
export default register
