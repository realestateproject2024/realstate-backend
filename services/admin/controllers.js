var jwt = require("jsonwebtoken");

const Admin = require("./adminModel");
const { userRole } = require("../../helpers/constants/userRole");

exports.createUser = async (req, res, next) => {
  const {
    id = null,
    email = null,
    password = null,
    role = userRole.executive,
  } = req.body;
  try {
    const existingUser = await Admin.getUserByEmailAndPassword(email, password);
    if (existingUser != null)
      return res.status(400).send({ message: "User already exists" });

    const user = new Admin(id, email, password, role);

    let response = await user.save();

    const token = jwt.sign(
      {
        id: response[0]?.insertId,
        email,
        role,
      },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res
      .status(201)
      .send({ id: response[0]?.insertId, email, role, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Admin.getUserByEmailAndPassword(email, password);
    if (existingUser == null)
      return res.status(400).send({ message: "User not found" });

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const response = {
      ...existingUser,
      token,
    };

    return res.status(201).send(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
