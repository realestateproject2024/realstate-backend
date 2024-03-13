// Middleware to cast request body types
const castTypesMiddlewareProperty = (req, res, next) => {
  // Convert string boolean values to actual boolean
  const booleanFields = [
    "commercial",
    "residential",
    "lounge",
    "elevator",
    "propertySanitation",
    "propertyLoungeStaircase",
    "propertyDriverRoom",
    "propertyCourtyard",
    "propertyMaidsRoom",
    "propertyfeatured",
    "availabilityOfElectricity",
    "availabilityOfWater",
  ];
  booleanFields.forEach((field) => {
    if (typeof req.body[field] === "string") {
      req.body[field] = req.body[field] === "true";
    }
  });

  // Convert string number values to actual number
  const numberFields = [
    "yearOfBuild",
    "price",
    "bedRooms",
    "kitchen",
    "toilets",
    "propertyRooms",
    "propertyViews",
  ];
  numberFields.forEach((field) => {
    if (!isNaN(req.body[field])) {
      req.body[field] = parseFloat(req.body[field]);
    }
  });

  // Convert string date values to actual date
  const dateFields = [
    "propertyDateAdded",
    "propertyLastUpdate",
    "lastRepairing",
  ];
  dateFields.forEach((field) => {
    if (Date.parse(req.body[field])) {
      req.body[field] = new Date(req.body[field]);
    }
  });

  next();
};

module.exports = {
  castTypesMiddlewareProperty,
};
