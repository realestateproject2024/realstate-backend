const fs = require("fs");
const path = require("path");

const PropertyModel = require("./propertyModel");
const { userRole } = require("../../helpers/constants/localConsts");

exports.getAllProperty = async (req, res) => {
  const { page = 1, count } = req.query;
  try {
    const limit = count || 15;
    const startIndex = (Number(page) - 1) * limit;

    const total = await PropertyModel.countDocuments({});

    const propertyList = await PropertyModel.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).send({
      data: propertyList,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Internal Server Error: " + error.message);
  }
};

exports.createProperty = async (req, res, next) => {
  const { propertyImages } = req.body;
  try {
    if (req?.user?.role == userRole.admin) {
      let imagePathArray = [];
      let response = createPropertyImage(propertyImages, imagePathArray);

      if (response) {
        response = {
          ...req.body,
          propertyImages: imagePathArray,
        };

        response = new PropertyModel(response);
        await response.save();

        res.status(200).send(response);
      } else {
        res
          .status(404)
          .send({ message: "Failed to add property. Please trt again later" });
      }
    } else {
      res.status(403).send({ message: "Unauthorized request" });
    }
  } catch (error) {
    res.status(400).send({
      message: "Failed to create property. Error details: " + error.message,
    });
  }
};

exports.editProperty = async (req, res, next) => {
  try {
    if (req?.user?.role != userRole.admin)
      return res.status(403).send({ message: "Unauthorized request" });

    if (req.body?.propertyImages && req.body.propertyImages?.length > 0) {
      const existingProperty = await PropertyModel.findById(req.body._id);

      let response = false;

      if (
        existingProperty?.propertyImages &&
        existingProperty.propertyImages?.length > 0
      ) {
        response = deletePropertyImages(existingProperty?.propertyImages);
      }

      if (response) {
        let imagePathArray = [];
        response = createPropertyImage(
          req.body?.propertyImages,
          imagePathArray
        );

        if (response) {
          response = {
            ...req.body,
            propertyImages: imagePathArray,
          };

          const updatedProperty = await PropertyModel.findByIdAndUpdate(
            req.body._id,
            response,
            {
              new: true,
            }
          );

          res.status(200).send(updatedProperty);
        } else {
          return res
            .status(404)
            .send({ message: "Failed to upload new images. Please try again" });
        }
      } else {
        return res.status(404).send({
          message: "Failed to remove existing images. Please try again",
        });
      }
    } else {
      const updatedProperty = await PropertyModel.findByIdAndUpdate(
        req.body._id,
        req.body,
        {
          new: true,
        }
      );

      res.status(200).send({ updatedProperty });
    }
  } catch (error) {
    res.status(400).send({
      message: "Failed to update property. Error details: " + error.message,
    });
  }
};

exports.deleteByPropertyId = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req?.user?.role != userRole.admin)
      return res.status(403).send({ message: "Unauthorized request" });

    const deletedProperty = await PropertyModel.findByIdAndDelete(id);

    if (
      deletedProperty?.propertyImages &&
      deletedProperty.propertyImages?.length > 0
    ) {
      deletePropertyImages(deletedProperty?.propertyImages);
    }

    res.status(200).send({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(400).send("Failed to delete: " + error.message);
  }
};

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  try {
    // if (req?.user?.role != userRole.admin)
    //   return res.status(403).send({ message: "Unauthorized request" });

    const fetchedProperty = await PropertyModel.findById(id);

    res.status(200).send(fetchedProperty);
  } catch (error) {
    res.status(400).send("Failed to delete: " + error.message);
  }
};

exports.searchProperty = async (req, res) => {
  const {
    address = null,
    type = null,
    city = null,
    district = null,
    maxPrice = null,
    minPrice = null,
    region = null,
    page = null,
    count = null,
  } = req.query;

  try {
    const pageNo = parseInt(page) || 1;
    const limit = parseInt(count) || 10;

    const startIndex = (pageNo - 1) * limit;

    const query = {};

    if (type) {
      query.typeOfProperty = { $regex: new RegExp(type, "i") };
    }

    if (address) {
      query.address = { $regex: new RegExp(address, "i") };
    }

    if (city) {
      query.city = { $regex: new RegExp(city, "i") };
    }

    if (district) {
      query.district = { $regex: new RegExp(district, "i") };
    }

    if (maxPrice || minPrice) {
      query.price = {};

      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }

      if (minPrice) {
        query.price.$gte = minPrice;
      }
    }

    if (region) {
      query.region = { $regex: new RegExp(region, "i") };
    }

    const totalCount = await PropertyModel.countDocuments(query);

    const propertyList = await PropertyModel.find(query)
      .skip(startIndex)
      .limit(limit);

    res.status(200).send({
      data: propertyList,
      currentPage: pageNo,
      numberOfPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const createPropertyImage = (imagesArray, pathArray) => {
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

  for (let i = 0; i < imagesArray.length; i++) {
    const imageName =
      Math.round(Math.random() * 10000).toString() + "d" + Date.now() + ".jpg";

    pathArray.push("files/property/" + imageName);

    const img = imagesArray[i].replace(/^[^,]+,/, "");

    fs.writeFile(dir + imageName, img, { encoding: "base64" }, (error) => {
      if (error) {
        return false;
      }
    });
  }

  return true;
};

const deletePropertyImages = async (imagesArray) => {
  const curPath = path.resolve(__dirname);
  const rootPath = path.join(curPath, "../../");

  for (let i = 0; i < imagesArray.length; i++) {
    fs.unlink(rootPath + imagesArray[i], function (err) {
      if (err) return false;
    });
  }

  return true;
};
