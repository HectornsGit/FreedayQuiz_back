import pool from '../../db/getPool.js';
import useDb from '../../db/useDb.js';
const createUser = async (name, email, hashedPassword, avatar) => {
  await useDb();
  const [{ insertId }] = await pool.query(
    'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, avatar]
  );
  return insertId;
};
export default createUser;
