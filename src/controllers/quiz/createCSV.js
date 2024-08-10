import { generateError } from '../../utils/index.js'
import { Parser } from '@json2csv/plainjs'

const createCSV = async (req, res, next) => {
    try {
        const playersData = req.body
        const parser = new Parser()
        const csv = parser.parse(playersData)
        if (!csv) {
            generateError('No se pudieron convertir los datos', 400)
        }
        res.send({ message: 'Datos convertidos a .csv', csv: csv })
    } catch (err) {
        next(err)
    }
}

export default createCSV
