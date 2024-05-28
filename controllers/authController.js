const jwt = require("jsonwebtoken");
const { User } = require("../schemas");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ name, email, password, role: role });
    await newUser.save();
    const accessToken = jwt.sign(
      { email: newUser.email },
      process.env.SECRET_KEY
    );
    res.status(200).json({ accessToken, newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email, password })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        { email: user.email, name: user.name },
        process.env.SECRET_KEY
      );
      res.status(200).json({ accessToken, user });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error logging in" });
    });
};

const getUserDetails = async (req, res) => {
  let user = req.user;
  user = await User.findOne({ email: user.email });
  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  res.status(200).json({ user });
};

module.exports = { register, login, getUserDetails };
