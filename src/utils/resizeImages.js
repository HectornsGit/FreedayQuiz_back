import path from 'path'
import sharp from 'sharp'

const resizeImages = async (file, width, height) => {
    try {
        const outputFilename = `resized-${file.originalname}`
        const outputPath = path.join('./src/uploads/', outputFilename)
        await sharp(file.buffer)
            .resize(width, height, {
                fit: 'contain',
                kernel: sharp.kernel.cubic,
            })
            .jpeg({ quality: 85 })
            .toFile(outputPath)
        return outputFilename
    } catch (error) {
        throw error
    }
}
export default resizeImages
