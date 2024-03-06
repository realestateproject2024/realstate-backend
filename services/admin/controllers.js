const AdminModel = require("./adminModel");

exports.createUser = async (req, res, next) => {
  try {
    const exixtingUser = await AdminModel.findOne({ email: req.body.email });

    if (exixtingUser != null) {
      return res.status(404).send({ message: "User already exists" });
    }

    const user = new AdminModel(req.body);

    await user.save();

    res.status(200).json({
      user: user,
      token: user.generateJWT(),
      message: "Data created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const existingUser = await AdminModel.findOne({ email: req.body.email });

    if (existingUser == null) {
      return res.status(404).send({ message: "User not found" });
    }

    let result = null;

    if (await existingUser.authenticate(req.body.password)) {
      const token = existingUser.generateJWT();
      result = {
        user: existingUser,
        token,
        message: "User login successfully",
      };
    } else {
      result = {
        user: null,
        token: null,
        message: "Invalid user credentials",
      };
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const userList = await AdminModel.find();

    res.status(200).json(userList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    await AdminModel.findByIdAndDelete(req.query.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
