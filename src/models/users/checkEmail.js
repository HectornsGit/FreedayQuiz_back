import pool from '../../db/getPool';
import useDb from '../../db/useDb';
const checkEmail = async (email) => {
  await useDb();
  const [[existingUser]] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return existingUser;
};
export default checkEmail;
