const BankModel = require("./bankModel");

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
  const { name, phone, email, branchCode, iban, swiftNumber } = req.body;

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
      const newBank = new BankModel(req.body);

      await newBank.save();
      res.status(201).json(newBank);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBankById = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updateBank = await BankModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json(updateBank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBankById = async (req, res) => {
  const { id } = req.params;
  try {
    await BankModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Bank deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
