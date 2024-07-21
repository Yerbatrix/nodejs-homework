const jwt = require("jsonwebtoken");
const { User } = require("../service/schemas/user");
require("dotenv").config();
const { sendEmail } = require("../email/sendEmail");
const { v4: uuidv4 } = require("uuid");

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }
    const verificationToken = uuidv4();
    const message = `<p>Welcome to my app!</p> <p>Here is the activation link:</p> <a href="http://localhost:3000/api/users/verify/${verificationToken}">Verify your email</a>`;
    const newUser = new User({
      email,
      subscription: "starter",
      verificationToken,
    });
    newUser.setPassword(password);
    await newUser.save();
    sendEmail(message, "Verification email", email).catch(console.error);
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        verify: false,
        verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
    user.token = token;
    await user.save();
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id: payload.id });
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

const logout = async (req, res, next) => {
  const userId = req.user._id;
  try {
    await User.findByIdAndUpdate(userId, { token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const current = (req, res, next) => {
  const user = req.user;
  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.verify = true;
    await user.save();
    res.json({
      message: "Verification successful",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const message = `<p>Here is another the activation link:</p> <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Verify your email</a>`;
    await sendEmail(message, "Verification email", email).catch(console.error);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  auth,
  logout,
  current,
  verify,
  resendVerificationEmail,
};
