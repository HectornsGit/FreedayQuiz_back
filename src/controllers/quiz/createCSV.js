import { generateError } from '../../utils/index.js'
import { Parser } from '@json2csv/plainjs'

const createCSV = async (req, res, next) => {
    try {
        const playersData = req.body
        const dataToConvert = playersData.map((player) => {
            return {
                Jugador: player.name,
                Puntos: player.totalScore,
                Racha: player.streak,
            }
        })
        const parser = new Parser({ fields: ['Jugador', 'Puntos', 'Racha'] })
        const csv = parser.parse(dataToConvert)
        if (!csv) {
            generateError('No se pudieron convertir los datos', 400)
        }
        res.send(csv)
    } catch (err) {
        next(err)
    }
}

export default createCSV
