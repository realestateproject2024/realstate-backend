const db = require("../../config/db");
const { dbNames } = require("../../helpers/constants/dbName");

class property {
  constructor(
    id,
    name,
    address,
    status,
    description,
    type,
    city,
    district,
    price,
    region
  ) {
    (this.id = id),
      (this.name = name),
      (this.address = address),
      (this.status = status),
      (this.description = description),
      (this.type = type),
      (this.city = city),
      (this.district = district),
      (this.price = price),
      (this.region = region);
  }

  async save() {
    let sql = `INSERT INTO property(
        name,
        address,
        status,
        description,
        type,
        city,
        district,
        price,
        region
    )VALUES(
      '${this.name}',
      '${this.address}',
      '${this.status}',
      '${this.description}',
      '${this.type}',
      '${this.city}',
      '${this.district}',
      '${this.price}',
      '${this.region}'
    )
    `;

    const result = await db.execute(sql);
    // this.id = result[0].insertId;

    return result;
  }

  async updateById() {
    let sql = `UPDATE property SET name='${this.name}', address='${this.address}', status='${this.status}', 
    description='${this.description}', type='${this.type}', city='${this.city}', district='${this.district}', 
    price='${this.price}', region='${this.region}' WHERE id='${this.id}'`;

    return db.execute(sql);
  }

  static async deleteById(id) {
    let sql = `DELETE FROM products WHERE id=${id};`;

    return db.execute(sql);
  }

  static async getTotalPropertiesCount() {
    const sql = `SELECT COUNT(*) FROM ${dbNames.propertyModel}`;
    return db.execute(sql);
  }

  static async getAllProperties(startIndex, limit) {
    let sql = `SELECT * FROM property LIMIT ${startIndex}, ${limit};`;

    return db.execute(sql);
  }

  static async getSearchedProperties(values, conditions) {
    const sql = `SELECT * FROM ${dbNames.propertyModel} WHERE ${conditions.join(
      " AND "
    )}`;

    return db.execute(sql, values);
  }

  static async deletePropertyById(id) {
    let sql = `DELETE FROM property WHERE id=${id};`;

    return db.execute(sql);
  }
}

module.exports = property;
