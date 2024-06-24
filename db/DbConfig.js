import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const pool = mysql2.createPool({
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB,
  connectionLimit: 10,
});
pool.getConnection((err, connection) => {
  if (err) {
    console.error("error connecting:", err);
  } else {
    console.log("Connected to Evangadi Database Sucessfully!!");
    //   console.log(connection)
    connection.release();
  }
});
export default pool.promise();
