import path from 'path'
import sharp from 'sharp'

const resizeImages = async (file) => {
    try {
        const outputFilename = `resized-${file.originalname}`
        const outputPath = path.join('./src/uploads/', outputFilename)
        await sharp(file.buffer)
            .resize(150, 150, { fit: 'cover', kernel: sharp.kernel.cubic })
            .jpeg({ quality: 85 })
            .toFile(outputPath)
        return outputFilename
    } catch (error) {
        throw error
    }
}
export default resizeImages
