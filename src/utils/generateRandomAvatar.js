import md5 from 'md5'
import { PassThrough } from 'stream'
import { cloudinary, generateError } from '../utils/index.js'
import fetch from 'node-fetch'

const generateRandomAvatar = async (email) => {
    try {
        const emailHash = md5(email.trim().toLowerCase())
        const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=robohash&f=y&s=128`
        const response = await fetch(gravatarUrl)

        if (!response.ok) {
            throw new Error('Error al descargar la imagen de Gravatar')
        }

        // Subir la imagen descargada a Cloudinary
        const avatar = await new Promise((resolve, reject) => {
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
                            new Error('Error al subir la imagen a Cloudinary')
                        )
                    }
                    resolve(result.secure_url)
                }
            )

            const bufferStream = new PassThrough()
            response.body.pipe(bufferStream)
            bufferStream.pipe(uploadStream)
        })
        return avatar
    } catch (error) {
        generateError(error)
    }
}
export default generateRandomAvatar
