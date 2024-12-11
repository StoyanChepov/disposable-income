const { User } = require("../models/User");
const bcrypt = require("bcrypt");

const identityName = "email";

async function register(identity, password) {
  const existing = await User.findOne({ [identityName]: identity });
  console.log("Existing: ", existing);

  if (existing) {
    throw new Error("User already exists", identityName);
  }
  const user = new User({
    [identityName]: identity,
    password: await bcrypt.hash(password, 10),
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  try {
    await user.save();
  } catch (error) {
    if ((error.code = 11000)) {
      throw new Error("User already exists", identityName);
    }
    console.log(error);
  }

  return user;
}

async function login(identity, password) {
  const user = await User.findOne({ [identityName]: identity });
  console.log("User: ", user);
  if (!user) {
    throw new Error("Email or password incorrect!");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Email or password incorrect");
  }

  return user;
}

module.exports = { register, login };
