const fs = require("fs");
const path = require("path");

const Property = require("./propertyModel");
const PropertyImage = require("./propertyImagesModel");

exports.getAllProperty = async (req, res) => {
  const { page, count } = req.query;
  try {
    const limit = count || 2;
    const startIndex = (Number(page) - 1) * limit;

    let total = await Property.getTotalPropertiesCount();

    if (total?.length > 0 && total[0]?.length > 0) {
      total = total[0][0]["COUNT(*)"];
    } else total = 0;

    let propertyList = await Property.getAllProperties(startIndex, limit);
    propertyList = propertyList[0];

    let allPropertyList = [];

    const promises = propertyList.map(async (property) => {
      const fetchedPropertyImage = await PropertyImage.getByPropertyImagesId(
        property.id
        // "199"
      );

      allPropertyList.push({
        ...property,
        images: fetchedPropertyImage[0],
      });
    });

    await Promise.all(promises);

    res.status(200).send({
      data: allPropertyList,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    // Handle errors appropriately
    console.error("Error:", error);
    res.status(400).send("Internal Server Error: " + error.message);
  }
};

exports.createProperty = async (req, res, next) => {
  const {
    id = null,
    name = null,
    address = null,
    status = null,
    description = null,
    type,
    city = null,
    district = null,
    price = null,
    region = null,
    property_image = null,
  } = req.body;

  try {
    let property = new Property(
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
    );

    if (req.user.role != "admin") return res.status(403).send({message: "Not authorized"});

    const propertyId = await property.save();

    let propertyImageList = await createPropertyImage(
      id,
      property_image,
      propertyId[0].insertId
    );

    property = {
      ...property,
      id: propertyId[0].insertId,
      images: propertyImageList,
    };

    res.status(201).send(property);
  } catch (error) {
    res.status(404).send({
      message: "Failed to create property. Error details: " + error.message,
    });
  }
};

exports.editProperty = async (req, res, next) => {
  const {
    id = null,
    name = null,
    address = null,
    status = null,
    description = null,
    type,
    city = null,
    district = null,
    price = null,
    region = null,
    property_image = null,
  } = req.body;

  try {
    let property = new Property(
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
    );

    await property.updateById();

    let propertyImageList = [];

    if (property_image?.length > 0) {
      propertyImageList = await editPropertyImage(0, property_image, id);
    }

    property = {
      ...property,
      images: propertyImageList,
    };

    res.status(201).send(property);
  } catch (error) {
    res.status(404).send({
      message: "Failed to update property. Error details: " + error.message,
    });
  }
};

exports.deleteByPropertyId = async (req, res, next) => {
  const { id } = req.params;
  try {
    await deletePropertyImages(id);

    await PropertyImage.deleteByPropertyId(id);

    await Property.deletePropertyById(id);

    res.status(200).send({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

exports.searchProperty = async (req, res) => {
  const {
    address = null,
    type = null,
    city = null,
    district = null,
    price = null,
    region = null,
  } = req.query;

  try {
    const userInput = {
      address,
      type,
      city,
      district,
      price,
      region,
    };

    let conditions = [];
    let values = [];

    Object.keys(userInput).forEach((field) => {
      if (userInput[field] !== null && userInput[field].length > 0) {
        conditions.push(`${field} LIKE ?`);
        values.push(`%${userInput[field].replace("_partial_", "")}%`);
      }
    });

    const searchedData = await Property.getSearchedProperties(
      values,
      conditions
    );

    res.status(200).send(searchedData);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const createPropertyImage = async (id, property_image, propertyId) => {
  const curPath = path.resolve(__dirname);
  const rootPath = path.join(curPath, "../../");

  let dir = rootPath + "files/";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  dir = rootPath + "files/property/";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  let propertyImageList = [];

  for (let i = 0; i < property_image.length; i++) {
    const imageName =
      Math.round(Math.random() * 10000).toString() + "d" + Date.now() + ".jpg";

    let propertyImage = new PropertyImage(
      id,
      "files/property/" + imageName,
      propertyId
    );

    const propertyImageId = await propertyImage.save();

    const img = property_image[i].replace(/^[^,]+,/, "");

    fs.writeFile(dir + imageName, img, { encoding: "base64" }, (error) => {
      if (error) {
        return res.status(400).send({
          message:
            "Error in saving property image. Error details: " + error.message,
        });
      }
    });

    propertyImage = {
      id: propertyImageId[0].insertId,
      image: "files/property/" + imageName,
    };

    propertyImageList.push(propertyImage);
  }

  return propertyImageList;
};

const editPropertyImage = async (id, property_image, propertyId) => {
  await deletePropertyImages(propertyId);

  let propertyImageList = await createPropertyImage(
    id,
    property_image,
    propertyId
  );

  return propertyImageList;
};

const deletePropertyImages = async (propertyId) => {
  const curPath = path.resolve(__dirname);
  const rootPath = path.join(curPath, "../../");

  let fetchedPropertyImage = await PropertyImage.getByPropertyImagesId(
    propertyId
  );

  fetchedPropertyImage = fetchedPropertyImage[0];

  for (let i = 0; i < fetchedPropertyImage.length; i++) {
    PropertyImage.deleteByPropertyId(propertyId);
    try {
      fs.unlink(rootPath + fetchedPropertyImage[i].image, function (err) {
        if (err) console.log(err);
      });
    } catch (error) {
      return res.status(404).send(error);
    }
  }
};
