const db = require("../../config/db");

class property_image {
  constructor(id, image, propertyId) {
    (this.id = id), (this.image = image), (this.propertyId = propertyId);
  }

  async save() {
    let sql = `INSERT INTO property_image(
        image,
        propertyId
    )VALUES(
      '${this.image}',
      '${this.propertyId}'
    )
    `;

    const result = await db.execute(sql);
    this.id = result[0].insertId;

    return result;
  }

  static async deleteByPropertyId(propertyId) {
    let sql = `DELETE FROM property_image WHERE propertyId=${propertyId};`;

    return db.execute(sql);
  }

  static async getByPropertyImagesId(propertyId) {
    let sql = `SELECT * FROM property_image WHERE propertyId=${propertyId};`;

    return db.execute(sql);
  }
}

module.exports = property_image;
