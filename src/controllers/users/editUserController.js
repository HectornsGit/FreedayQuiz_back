import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs/promises'
import { getUserById } from '../../models/users/index.js'
import { editUser } from '../../models/users/index.js'
import { validationSchemaRegister } from '../../utils/index.js'
import { PassThrough } from 'stream'
import { cloudinary } from '../../utils/index.js'

const editUserController = async (req, res, next) => {
    try {
        const userId = req.auth.id

        const userData = await getUserById(userId)
        const userToUpdate = {
            ...userData[0],
            ...req.body,
        }

        let { name, email, password, avatar } = userToUpdate

        // Si envías una nueva foto, se borra la anterior de la carpeta uploads:
        if (req.file) {
            const defaultImageUrl = process.env.DEFAULT_IMAGE_USER

            if (avatar !== defaultImageUrl) {
                const publicId = avatar.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(publicId)
            }

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

        //Validación con Joi:
        const validationObject = {
            name,
            email,
            password,
        }
        const { error } = validationSchemaRegister.validate(validationObject)

        if (error) {
            error.message = error.details[0].message
            throw error
        }
        let hashedPassword = password
        req.body.password
            ? (hashedPassword = await bcrypt.hash(password, 10))
            : (hashedPassword = password)

        await editUser(name, email, hashedPassword, avatar, userId)
        res.send({
            status: 'Ok',
            data: {
                message: 'Datos actualizados correctamente',
                name,
                email,
                avatar,
                userId,
            },
        })
    } catch (error) {
        next(error)
    }
}

export default editUserController
