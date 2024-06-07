import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';

const editUser = async (name, email, hashedPassword, avatar, id) => {
  await useDb();
  const [{ insertId }] = await pool.query(
    'UPDATE users SET name = ?, email = ?, password = ?, avatar = ? WHERE id = ?',
    [name, email, hashedPassword, avatar, id]
  );
  return insertId;
};
export default editUser;
