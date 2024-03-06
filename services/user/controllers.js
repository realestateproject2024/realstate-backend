const UserModel = require("./userModel");
const OTPModel = require("./otpModel");

exports.signUp = async (req, res, next) => {
  const { phone, email } = req.body;
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ phone }, { email }],
    });

    if (existingUser != null)
      return res.status(403).send({ message: "User already exists" });

    // let otp = Math.floor(100000 + Math.random() * 900000);
    let otp = 123456;

    // this otp will be shared to mobile number
    console.log(otp);

    const otpModel = new OTPModel({ phone, otp });

    await otpModel.save();

    return res.status(201).send({ message: "OTP send successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    let data = await OTPModel.findOne({ phone });
    if (data != null) {
      if (phone == data.phone) {
        if (await data.authenticate(otp)) {
          await OTPModel.deleteOne({ phone });
          return res
            .status(200)
            .send({ message: "Otp verified successfully!" });
        } else {
          return res.status(404).send({ message: "Wrong otp" });
        }
      } else {
        return res.status(404).send({ message: "Wrong mobile number" });
      }
    } else {
      return res.status(404).send({ message: "Invalid Otp!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { phone, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ phone }, { email }],
    });

    if (existingUser == null)
      return res.status(404).json({ message: "User not found" });

    if (await existingUser.authenticate(password)) {
      const token = existingUser.generateJWT();
      res.status(200).send({
        user: existingUser,
        token,
        message: "User login successfully",
      });
    } else {
      res.status(401).send({
        user: null,
        token: null,
        message: "Invalid user credentials",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createNewUser = async (req, res) => {
  const { phone, email } = req.body;

  try {
    const payload = {
      name: req.body.name,
      dob: req.body.dob,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      employmentType: req.body.employmentType,
      employmentGrade: req.body.employmentGrade,
      employerName: req.body.employerName,
      dateOfJoiing: req.body.dateOfJoiing,
      basicSalary: req.body.basicSalary,
      totalSalary: req.body.totalSalary,
      financerName: req.body.financerName,
      instalmentType: req.body.instalmentType,
      amount: req.body.amount,
      emisPaid: req.body.emisPaid,
    };

    payload.dob = new Date(payload.dob);
    payload.dateOfJoiing = new Date(payload.dateOfJoiing);
    payload.amount = parseInt(payload.amount, 10);
    payload.emisPaid = parseInt(payload.emisPaid, 10);
    payload.basicSalary = parseInt(payload.basicSalary, 10);
    payload.totalSalary = parseInt(payload.totalSalary, 10);

    const existingUser = await UserModel.findOne({
      $or: [{ phone }, { email }],
    });
    let result = null;

    if (existingUser != null) {
      return res.status(403).json({ message: "User already exist" });
    } else {
      const newUser = new UserModel(payload);

      await newUser.save();

      result = {
        user: newUser,
        token: newUser.generateJWT(),
        message: "User created successfully",
      };
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find();

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.query.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
