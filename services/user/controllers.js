const UserModel = require("./userModel");
const OTPModel = require("./otpModel");

exports.signUp = async (req, res, next) => {
  const { phone } = req.body;
  try {
    // let otp = Math.floor(100000 + Math.random() * 900000);
    let otp = 123456;

    // this otp will be shared to mobile number
    console.log(otp);

    const otpModel = new OTPModel({ phone, otp });

    await otpModel.save();

    return res.status(201).send({ message: "OTP send successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createNewUser = async (req, res) => {
  const { phone, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ phone }, { email }],
    });
    let result = null;

    if (existingUser != null) {
      if (await existingUser.authenticate(password)) {
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
    } else {
      const newUser = new UserModel(req.body);

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

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.findByIdAndDelete(id);

    res.status(201).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
