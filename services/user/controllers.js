const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const User = require("./userModel");
const Otp = require("./otpModel");
const { userRole } = require("../../helpers/constants/userRole");

exports.signUp = async (req, res, next) => {
  const { mobile } = req.body;
  try {
    // let otp = Math.floor(100000 + Math.random() * 900000);
    let otp = 765646;
    const salt = await bcrypt.genSalt(10);
    const hashed_otp = await bcrypt.hash(otp.toString(), salt);

    // this otp will be shared to mobile number
    console.log(otp);

    const otpModel = new Otp(0, mobile, hashed_otp);

    await otpModel.save();

    removeModel = async () => {
      await Otp.deleteDataByMobile(mobile);
    };
    setTimeout(removeModel, 30000);

    return res.status(201).send({ message: "OTP send successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  try {
    let data = await Otp.getDataByMobile(mobile);
    if (data[0].length > 0) {
      data = data[0][0];
      if (mobile == data.mobile) {
        const validUser = await bcrypt.compare(otp, data.otp);
        if (validUser) {
          await Otp.deleteDataByMobile(mobile);

          return res
            .status(200)
            .send({ message: "Otp verified successfully!" });
        }
      }
    } else {
      return res.status(200).send({ message: "Invalid Otp!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.validateUser = async (req, res) => {
  const {
    id,
    name,
    dob = null,
    mobile: phone,
    employmentType = null,
    employerName = null,
    dateOfJoiing = null,
    basicSalary = null,
    totalSalary = null,
  } = req.body;

  try {
    let existingUser = await User.getUserByMobile(phone);

    if (existingUser[0]?.length > 0) {
      existingUser = existingUser[0][0];

      const token = jwt.sign(
        {
          id: existingUser.id,
          number: existingUser.phone,
          role: userRole.user,
        },
        process.env.AUTH_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).send({
        id: existingUser.id,
        name: existingUser.name,
        dob: existingUser.dob,
        number: existingUser.phone,
        employmentType: existingUser.employmentType,
        employerName: existingUser.employerName,
        dateOfJoiing: existingUser.dateOfJoiing,
        basicSalary: existingUser.basicSalary,
        totalSalary: existingUser.totalSalary,
        token,
      });
    } else {
      const newUser = new User(
        id,
        name,
        dob,
        phone,
        employmentType,
        employerName,
        dateOfJoiing,
        basicSalary,
        totalSalary
      );

      const userId = await newUser.save();

      const token = jwt.sign(
        {
          id: userId,
          number: phone,
          role: userRole.user,
        },
        process.env.AUTH_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).send({
        id: userId[0].insertId,
        name,
        dob,
        number: phone,
        employmentType,
        employerName,
        dateOfJoiing,
        basicSalary,
        totalSalary,
        token,
      });
    }
  } catch (error) {
    res.status(400).json({ error: `Error in user auth ${error.message}` });
  }
};

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.getUserById(id);
    if (user[0]?.length == 0)
      return res.status(404).json({ message: "No user found" });

    res.status(200).json({ user: user[0][0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserById = async (req, res, next) => {
  const {
    id,
    name,
    dob,
    phone,
    employmentType = null,
    employerName = null,
    dateOfJoiing = null,
    basicSalary = null,
    totalSalary = null,
  } = req.body;
  try {
    let user = new User(
      id,
      name,
      dob,
      phone,
      employmentType,
      employerName,
      dateOfJoiing,
      basicSalary,
      totalSalary
    );

    await user.updateById();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    await User.deleteUserById(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
