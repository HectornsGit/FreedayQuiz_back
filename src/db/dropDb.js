import pool from './getPool.js';
import useDb from './useDb.js';

const deleteDb = async () => {
  try {
    await useDb();
    await pool.query(`DROP DATABASE IF EXISTS ${process.env.NAME_DB};`);

    console.log('Base de datos borrada con éxito');
  } catch (error) {
    console.log('No se ha podido borrar la base de datos');
  }
};

deleteDb();
