const db = require("../../config/db");
const { dbNames } = require("../../helpers/constants/dbName");

class user {
  constructor(
    id,
    name,
    dob,
    phone,
    employmentType,
    employerName,
    dateOfJoiing,
    basicSalary,
    totalSalary
  ) {
    (this.id = id),
      (this.name = name),
      (this.dob = dob),
      (this.phone = phone),
      (this.employmentType = employmentType),
      (this.employerName = employerName),
      (this.dateOfJoiing = dateOfJoiing),
      (this.basicSalary = basicSalary),
      (this.totalSalary = totalSalary);
  }

  async save() {
    let sql = `INSERT INTO ${dbNames.userModel}(
        name,
        dob,
        phone,
        employmentType,
        employerName,
        dateOfJoiing,
        basicSalary,
        totalSalary
    ) VALUES (?, STR_TO_DATE(?, '%Y-%m-%d'), ?, ?, ?, ?, ?, ?)`;

    const values = [
      this.name,
      this.dob, // Assuming this.dob is a string in 'YYYY-MM-DD' format
      this.phone,
      this.employmentType,
      this.employerName,
      this.dateOfJoiing, // Assuming dateOfJoiing is a JavaScript Date object
      this.basicSalary,
      this.totalSalary,
    ];

    const result = await db.execute(sql, values);

    return result;
  }

  async updateById() {
    let sql = `UPDATE ${dbNames.userModel} SET name='${this.name}', dob='${this.dob}', phone='${this.phone}', 
    employmentType='${this.employmentType}', employerName='${this.employerName}', dateOfJoiing='${this.dateOfJoiing}', 
    basicSalary='${this.basicSalary}', totalSalary='${this.totalSalary}' WHERE id='${this.id}'`;

    return db.execute(sql);
  }

  static async getUserByMobile(phone) {
    let sql = `SELECT * FROM ${dbNames.userModel} WHERE phone=${phone};`;

    return db.execute(sql);
  }

  static async getUserById(id) {
    let sql = `SELECT * FROM ${dbNames.userModel} WHERE id=${id};`;

    return db.execute(sql);
  }

  static async deleteUserById(id) {
    let sql = `DELETE FROM ${dbNames.userModel} WHERE id=${id};`;

    return db.execute(sql);
  }
}

module.exports = user;
