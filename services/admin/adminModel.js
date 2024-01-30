const bcrypt = require("bcrypt");

const db = require("../../config/db");
const { dbNames } = require("../../helpers/constants/dbName");

class admin {
  constructor(id, email, password, role) {
    (this.id = id),
      (this.email = email),
      (this.password = password),
      (this.role = role);
  }

  async save() {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(this.password, 10);

    const sql = `INSERT INTO ${dbNames.adminModel}(
        email, password, role
    )VALUES(
      '${this.email}',
      '${hashedPassword}',
      '${this.role}'
    )
    `;

    const result = await db.execute(sql);

    return result;
  }

  static async getUserByEmailAndPassword(email, password) {
    try {
      let sql = `SELECT * FROM ${dbNames.adminModel} WHERE email='${email}'`;

      const [rows, fields] = await db.execute(sql);

      if (rows.length === 1) {
        // Compare hashed passwords
        const isPasswordMatch = await bcrypt.compare(
          password,
          rows[0].password
        );

        if (isPasswordMatch) {
          return rows[0]; // Passwords match, return the user
        }
      }

      return null; // No matching user or password doesn't match
    } catch (error) {
      console.error("Error retrieving user:", error.message);
      throw error; // Re-throw the error to indicate failure
    }
  }

  static async getUserById(id) {
    let sql = `SELECT * FROM ${dbNames.adminModel} WHERE id=${id};`;

    return db.execute(sql);
  }

  static async deleteUserById(id) {
    let sql = `DELETE FROM ${dbNames.adminModel} WHERE id=${id};`;

    return db.execute(sql);
  }
}

module.exports = admin;
