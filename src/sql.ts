import mysql from "mysql2/promise";
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Student_planner",
  port: 3306,
});

export async function login_validation(username: string, pass: string) {
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
  }
}
export async function create_user(firstname: string, lastname: string, username: string, password: string,email:string) {
  const sql_typing = "INSERT INTO users (firstname,lastname,username,hash,email) VALUES (?,?,?,?,?)"
  const [rows_k] = await connection.execute("SELECT username FROM users WHERE username = ?", [username])

  if (rows_k.length != 1) {
    const [rows] = await connection.execute(sql_typing, [firstname, lastname, username, await Bun.password.hash(password),email])
    if (rows.affectedRows === 1) {
      return "register successfully.";
    }
  }
  return "user alrady exits"
}