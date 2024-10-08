import bcrypt from 'bcrypt'
import { generateError, generateRandomAvatar } from '../../utils/index.js'
import { validationSchemaRegister } from '../../utils/index.js'
import { checkEmail, createUser } from '../../models/users/index.js'
import { PassThrough } from 'stream'
import { cloudinary } from '../../utils/index.js'

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        // Lógica para tratar las imágenes:
        let avatar

        if (!req.file) {
            //Genero una imagen aleatoria:
            avatar = await generateRandomAvatar(email)
        } else {
            avatar = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'users',
                        transformation: {
                            width: 150,
                            height: 150,
                            crop: 'fill',
                        },
                    },
                    (error, result) => {
                        if (error) {
                            return reject(
                                new Error(
                                    'Error al subir la imagen a Cloudinary'
                                )
                            )
                        }
                        resolve(result.secure_url)
                    }
                )

                const bufferStream = new PassThrough()
                bufferStream.end(req.file.buffer)
                bufferStream.pipe(uploadStream)
            })
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
