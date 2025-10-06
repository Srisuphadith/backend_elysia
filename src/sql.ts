import mysql from "mysql2/promise";
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "CPE241_SHOP",
  port: 3306,
});

export async function login_validation(username: string, pass: string) {
  const sql_typing = "SELECT password_hash FROM tbl_users WHERE userName = ?"
  try {
    const [rows] = await connection.execute(sql_typing, [username]);
    if (rows.length === 1) {
      if (await Bun.password.verify(pass, rows[0].password_hash)) {
        return "login successfully"
      }
    }
    return "login faild"

  } catch (err) {
    console.error("Error fetching users:", err);
  }
}
export async function create_user(firstname: string, lastname: string, username: string, password: string) {
  const sql_typing = "INSERT INTO tbl_users (firstName,lastName,userName,password_hash) VALUES (?,?,?,?)"
  const [rows_k] = await connection.execute("SELECT userName FROM tbl_users WHERE userName = ?", [username])
  if (rows_k.length != 1) {
    console.log(rows_k)
    const [rows] = await connection.execute(sql_typing, [firstname, lastname, username, await Bun.password.hash(password)])
    if (rows.affectedRows === 1) {
      return "register successfully.";
    }
  }
  return "user alrady exits"
}