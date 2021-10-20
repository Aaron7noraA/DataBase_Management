import mysql from "mysql";

export const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "k31883188",
  database: "test",
});
