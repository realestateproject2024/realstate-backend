const Enquiry = require("./enquiryModel");

exports.getAllEnquiry = async (req, res, next) => {
  try {
    const enquiryList = await Enquiry.find();

    res.status(200).send({
      status: 200,
      data: enquiryList,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).send({
      status: 201,
      data: enquiry,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.updateEnquiry = async (req, res) => {
  const { enquiryId } = req.query;
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(enquiryId, req.body, {
      new: true,
    });

    if (!enquiry) {
      throw new Error("Enquiry not found");
    }

    res.status(200).send({
      status: 200,
      data: enquiry,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.deleteEnquiry = async (req, res) => {
  const { enquiryId } = req.query;
  try {
    await Enquiry.findByIdAndDelete(enquiryId);
    res.status(200).send({
      status: 200,
      message: "Equiry deleted successfully",
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.addPropertyInInquiry = async (req, res) => {
  const { enquiryId } = req.query;

  try {
    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      return res.status(404).send({
        status: 404,
        message: "Error: no data found. Please try again later.",
      });
    }

    enquiry.properties.push(req.body);

    const updatedEnquiry = await enquiry.save();

    res.status(201).send({
      status: 201,
      data: updatedEnquiry,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.updatePropertyInEnquiry = async (req, res) => {
  const { enquiryId, propertyId } = req.query;
  const updatedProperty = req.body;
  try {
    // Find the enquiry by ID
    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      throw new Error("Enquiry not found");
    }

    const propertyIndex = enquiry.properties.findIndex(
      (property) => property.propertyId == propertyId
    );

    if (propertyIndex === -1) {
      throw new Error("Property not found in enquiry");
    }

    // Update the property
    enquiry.properties[propertyIndex] = {
      ...enquiry.properties[propertyIndex],
      ...updatedProperty,
    };

    // Save the updated enquiry
    const updatedEnquiry = await enquiry.save();

    res.status(200).send({
      status: 200,
      data: updatedEnquiry,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.deletePropertyInEnquiry = async (req, res, next) => {
  const { enquiryId, propertyId } = req.query;
  try {
    // Find the enquiry by ID
    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      throw new Error("Enquiry not found");
    }

    // Filter out the property to delete from the properties array
    enquiry.properties = enquiry.properties.filter(
      (property) => property.propertyId != propertyId
    );

    // Save the updated enquiry
    const updatedEnquiry = await enquiry.save();

    res.status(200).send({
      status: 200,
      data: updatedEnquiry,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.addTaskInProperty = async (req, res) => {
  const { enquiryId, propertyId } = req.query;

  try {
    const newTask = req.body;

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      enquiryId,
      {
        $push: {
          "properties.$[property].tasks": newTask,
        },
      },
      {
        arrayFilters: [{ "property.propertyId": propertyId }],
        new: true, // Return the modified document
      }
    ).exec();

    res.status(201).send({
      status: 201,
      message: "Enquiry updated with new task",
      data: updatedEnquiry,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.updateTaskInProperty = async (req, res, next) => {
  try {
    const { enquiryId, propertyId, taskId } = req.query;
    const updatedTask = req.body;

    const updatedEnquiry = await Enquiry.findOneAndUpdate(
      {
        _id: enquiryId,
        "properties.propertyId": propertyId,
        "properties.tasks._id": taskId,
      },
      {
        $set: {
          "properties.$[property].tasks.$[task]": updatedTask,
        },
      },
      {
        arrayFilters: [
          { "property.propertyId": propertyId },
          { "task._id": taskId },
        ],
        new: true,
      }
    ).exec();

    if (!updatedEnquiry) {
      return res.status(404).send({
        status: 404,
        message: "Enquiry, property, or task not found",
      });
    }

    res.status(200).send({
      status: 200,
      message: "Task updated successfully",
      data: updatedEnquiry,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.deleteTaskFromProperty = async (req, res) => {
  try {
    const { enquiryId, propertyId, taskId } = req.query;

    const updatedEnquiry = await Enquiry.findOneAndUpdate(
      {
        _id: enquiryId,
        "properties.propertyId": propertyId,
      },
      {
        $pull: {
          "properties.$[property].tasks": { _id: taskId },
        },
      },
      {
        arrayFilters: [{ "property.propertyId": propertyId }],
      }
    ).exec();

    if (!updatedEnquiry) {
      return res.status(404).send({
        status: 404,
        message: "Enquiry or property not found",
      });
    }

    res.status(200).send({
      status: 200,
      message: "Task removed successfully",
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};
