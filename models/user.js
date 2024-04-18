// models/user.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required."],
  },
  // Email field with type String, required
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  // Password field with type String, required
  password: {
    type: String,
    required: [true, "Password is required."],
  },
});

// Middleware function to hash the password before saving
userSchema.pre("save", async function (next) {
  // Checking if the password has been modified
  if (!this.isModified("password")) {
    return next();
  }
  // Generating a salt for password hashing
  const salt = await bcrypt.genSalt(10);
  // Hashing the password using bcrypt with the generated salt
  this.password = bcrypt.hashSync(this.password, salt);
  // Proceeding to the next middleware
  next();
});

// Method to compare passwords for authentication
userSchema.methods.matchPassword = async function (password) {
  // Comparing the provided password with the hashed password stored in the database
  return await bcrypt.compare(password, this.password);
};

// Creating the User model based on the user schema
const User = mongoose.model("User", userSchema);

// Exporting the User model to be used by other modules
module.exports = User;
