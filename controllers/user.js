// controllers/user.js
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

// helper to delete password and __v from user object
function sanitizeUser(user) {
  if (!user || typeof user !== "object") {
    console.log("Invalid user object.");
    return null;
  }
  const sanitizedUser = { ...user._doc };
  delete sanitizedUser.password;
  delete sanitizedUser.__v;
  return sanitizedUser;
}

const handleRegister = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(422)
      .json({ message: "Please enter all of the required inputs." });
  }
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists." });
    }

    const newUser = new User({ fullname, email, password });

    await newUser.save();

    const sanitizedUser = sanitizeUser(newUser);

    const token = generateToken(newUser);

    res.status(201).json({ ...sanitizedUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong..." });
  }
};

// Function to handle user login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(422)
      .json({ message: "Please enter all of the required inputs." });

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found or password doesn't match, return an error
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = generateToken(user);

    const sanitizedUser = sanitizeUser(user);

    // Send the user with the token in the response
    res.status(200).json({ ...sanitizedUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { handleRegister, handleLogin };
