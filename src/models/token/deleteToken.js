import useDb from "../../db/useDb.js";
import pool from "../../db/getPool.js";

const deleteToken = async (userId) => {
  await useDb();
  await pool.query("DELETE FROM temporaryToken WHERE userId = ?", [userId]);
};
export default deleteToken;
