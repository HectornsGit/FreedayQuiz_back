import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs/promises'
import { getUserById } from '../../models/users/index.js'
import { editUser } from '../../models/users/index.js'
import { resizeImages, validationSchemaRegister } from '../../utils/index.js'

const editUserController = async (req, res, next) => {
    try {
        const userId = req.auth.id

        const userData = await getUserById(userId)
        const userToUpdate = {
            ...userData[0],
            ...req.body,
        }

        let { name, email, password, avatar } = userToUpdate
        const defaultImage = 'imagenPredeterminada.png'

        // Si envías una nueva foto, se borra la anterior de la carpeta uploads:
        if (req.file) {
            const oldImagePath = path.join('src', 'uploads', userData[0].avatar)
            // const newImagePath = path.join(
            //     'src',
            //     'uploads',
            //     `resized-${req.file.originalname}`
            // )

            try {
                // Si la imagen actual es diferente a la predeterminada, se elimina la anterior:
                if (userData[0].avatar !== defaultImage) {
                    await fs.unlink(oldImagePath)
                }
                avatar = await resizeImages(req.file, 150, 150)
            } catch (error) {
                console.error(
                    'Error al acceder o eliminar la imagen actual:',
                    error.message
                )
            }
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
