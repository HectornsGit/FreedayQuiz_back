import useDb from "../../db/useDb.js";
import pool from "../../db/getPool.js";

const getToken = async (frontId, frontToken) => {
  await useDb();
  const [[{ userId }]] = await pool.query(
    "SELECT userId FROM temporaryToken WHERE userId = ? AND token = ?",
    [frontId, frontToken]
  );
  return userId;
};
export default getToken;
