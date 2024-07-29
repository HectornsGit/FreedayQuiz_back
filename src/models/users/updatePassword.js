import pool from '../../db/getPool.js'
import useDb from '../../db/useDb.js'

const updatePassword = async (password, id) => {
    await useDb()
    const [result] = await pool.query(
        'UPDATE users SET password = ?  WHERE id = ?',
        [password, id]
    )
    const { affectedRows, changedRows } = result

    return { affectedRows, changedRows }
}
export default updatePassword
