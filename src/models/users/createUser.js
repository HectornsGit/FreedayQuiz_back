import pool from '../../db/getPool.js';

const createUser = async (name, email, hashedPassword) => {
  const [{ insertId }] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return insertId;
};
export default createUser;
