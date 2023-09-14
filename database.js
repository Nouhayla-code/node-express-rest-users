import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "users_db",
  password: "Mysql123",
  multipleStatements: true,
});

export default connection;
