const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  UnauthorizedError,
} = require("../utils/error-handler");

const identityName = "email";

async function register(identity, password) {
  try {
    const existing = await User.findOne({ [identityName]: identity });
    if (existing) {
      throw new BadRequestError(`User already exists: ${identityName}`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      [identityName]: identity,
      password: hashedPassword,
    });

    await user.save();
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new BadRequestError(`User already exists: ${identityName}`);
    }
    console.error("Error in registration:", error);
    throw new Error("Registration failed. Please try again.");
  }
}

async function login(identity, password) {
  try {
    const user = await User.findOne({ [identityName]: identity });
    if (!user) {
      throw new UnauthorizedError("Email or password incorrect.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedError("Email or password incorrect.");
    }

    return user;
  } catch (error) {
    console.error("Error in login:", error);
    throw new Error("Login failed. Please try again.");
  }
}

module.exports = { register, login };
