const db = require("../../config/db");

const { dbNames } = require("../../helpers/constants/dbName");

class otp {
  constructor(id, mobile, otp) {
    (this.id = id), (this.mobile = mobile), (this.otp = otp);
  }

  async save() {
    let sql = `INSERT INTO ${dbNames.otpModel}(
        mobile,
        otp
    )VALUES(
      '${this.mobile}',
      '${this.otp}'
    )
    `;

    return db.execute(sql);
  }

  static async deleteDataByMobile(mobile) {
    let sql = `DELETE FROM ${dbNames.otpModel} WHERE mobile=${mobile};`;

    return db.execute(sql);
  }

  static async getDataByMobile(mobile) {
    let sql = `SELECT * FROM ${dbNames.otpModel} WHERE mobile=${mobile};`;

    return db.execute(sql);
  }
}

module.exports = otp;
