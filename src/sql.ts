import mysql from "mysql2/promise";
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "CPE241_SHOP",
  port: 3306,
});

export async function fetchUsers() {
  try {
    const [rows] = await connection.execute("SELECT * FROM tbl_users");
    //console.log(rows);
    return rows
  } catch (err) {
    console.error("Error fetching users:", err);
  }

}
export async function password_validation(username:string,pass:string) {
    const sql_typing = "SELECT * FROM tbl_users WHERE userName = '"+username+"' and password_hash = '"+pass+"'"
    try {
    const [rows] = await connection.execute(sql_typing);
    if(Object.keys(rows).length == 1){
        return "login successfully"
    }
    return "login faild"
    
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}