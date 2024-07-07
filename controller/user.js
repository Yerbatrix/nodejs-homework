const jwt = require("jsonwebtoken");
const { User } = require("../service/schemas/user");
require("dotenv").config();

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }
    const newUser = new User({ email, subscription: "starter" });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
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

module.exports = {
  signup,
  login,
  auth,
  logout,
  current,
};
