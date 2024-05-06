import 'dotenv/config';
import mysql from 'mysql2/promise';

const { HOST_DB, USER_DB, PASSWORD_DB, PORT_DB } = process.env;

const pool = mysql.createPool({
  host: HOST_DB,
  port: PORT_DB,
  user: USER_DB,
  password: PASSWORD_DB,
});

export default pool;
