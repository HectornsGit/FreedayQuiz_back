import useDb from '../../db/useDb.js'
import pool from '../../db/getPool.js'

const saveToken = async (token, userId) => {
    await useDb()
    await pool.query(
        'INSERT INTO temporaryToken (token, userId) VALUES (?, ?)',
        [token, userId]
    )
}
export default saveToken
