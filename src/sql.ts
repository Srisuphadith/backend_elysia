import mysql from "mysql2/promise";
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Student_planner",
  port: 3306,
});

export async function signin(username: string, pass: string) {
  const sql_typing = "SELECT hash FROM users WHERE username = ?"
  try {
    const [rows] = await connection.execute(sql_typing, [username]);
    if (rows.length === 1) {
      if (await Bun.password.verify(pass, rows[0].hash)) {
        return "login successfully"
      }
    }
    return "login faild"
  } catch (err) {
    console.error("Error fetching users:", err);
    return err
  }
}
export async function register(firstname: string, lastname: string, username: string, password: string, email: string) {
  const sql_insert_user = "INSERT INTO users (firstname,lastname,username,hash,email) VALUES (?,?,?,?,?)"
  const sql_check_user = "SELECT username FROM users WHERE username = ?"

  const [rows_k] = await connection.execute(sql_check_user, [username])
  if (rows_k.length != 1) {
    const [rows] = await connection.execute(sql_insert_user, [firstname, lastname, username, await Bun.password.hash(password), email])
    if (rows.affectedRows === 1) {
      return "register successfully.";
    }
  }
  return "user alrady exits"
}