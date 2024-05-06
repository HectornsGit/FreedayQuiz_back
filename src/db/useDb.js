import pool from './getPool.js';

const useDb = async () => {
  try {
    await pool.query(`USE ${process.env.NAME_DB};`);
  } catch (error) {
    error.message = `La base de datos ${process.env.NAME_DB} no existe. Ejecuta el initDb para iniciarla`;
    process.exit(1);
  }
};

export default useDb;
