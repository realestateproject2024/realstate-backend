const BankModel = require("./bankModel");
const fs = require("fs");

exports.getAllBanks = async (req, res) => {
  const { page = 1, count = 15 } = req.query;
  try {
    const startIndex = (Number(page) - 1) * count;

    const total = await BankModel.countDocuments({});

    const bankList = await BankModel.find()
      .sort({ _id: -1 })
      .limit(count)
      .skip(startIndex);

    res.status(200).send({
      data: bankList,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / count),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBankById = async (req, res) => {
  const { id } = req.params;

  try {
    const bank = await BankModel.findById(id);

    res.status(200).json(bank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createNewBank = async (req, res) => {
  const {
    name,
    phone,
    email,
    branchCode,
    iban,
    swiftNumber,
    image = null,
  } = req.body;

  try {
    const existingUser = await BankModel.findOne({
      $or: [
        { name },
        { phone },
        { email },
        { branchCode },
        { iban },
        { swiftNumber },
      ],
    });

    if (existingUser != null) {
      return res.status(403).json({
        message:
          "Bank already exist with the above fileds. Please check all fields properly",
      });
    } else {
      let data = req.body;
      if (image != null) {
        let dir = "files/";

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }

        dir = "files/bank/";

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }

        const img = image.replace(/^[^,]+,/, "");

        const imageToUpload =
          Math.round(Math.random() * 10000).toString() +
          "_" +
          Date.now() +
          ".jpg";

        fs.writeFile(
          dir + imageToUpload,
          img,
          { encoding: "base64" },
          (error) => {
            if (error) {
              res.status(404).send({
                message: `Error in uploading image: ${error.message}`,
              });
              return;
            }
          }
        );

        data = { ...data, image: dir + imageToUpload };
      }

      const newBank = new BankModel(data);

      await newBank.save();
      res.status(201).json(newBank);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBankById = async (req, res) => {
  const { image = null, ...data } = req.body;

  try {
    let reqBody = data;
    if (image != null) {
      const imageToUpload =
        Math.round(Math.random() * 10000).toString() +
        "_" +
        Date.now() +
        ".jpg";

      const dir = "files/bank/";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      const img = image.replace(/^[^,]+,/, "");

      fs.writeFile(
        dir + imageToUpload,
        img,
        { encoding: "base64" },
        (error) => {
          if (error) {
            console.log(error.message);
            reqBody.status = 404;
          }
        }
      );

      reqBody = {
        ...data,
        image: dir + imageToUpload,
      };

      const existingBank = await BankModel.findById(data?._id);

      if (existingBank?.image) {
        fs.unlink(existingBank.image, function (err) {
          if (err) {
            reqBody.status = 404;
          }
        });
      }
    }

    if (reqBody.status === 404) {
      reqBody = {
        message: "Failed to upload image",
        status: reqBody.status,
      };
      res.status(404).json(reqBody);
    } else {
      const updateBank = await BankModel.findByIdAndUpdate(data._id, reqBody, {
        new: true,
      });

      res.status(200).json(updateBank);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBankById = async (req, res) => {
  const { id } = req.params;
  try {
    let response = { message: "Bank deleted successfully", status: 200 };
    const existingBank = await BankModel.findById(id);

    if (existingBank?.image) {
      fs.unlink(existingBank.image, function (err) {
        if (err) {
          response.status = 404;
          response.message = "Failed to delete data";
        }
      });
    }

    await BankModel.findByIdAndDelete(id);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
