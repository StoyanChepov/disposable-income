const { Router } = require("express");
const { login } = require("../services/user.service");
const { register } = require("../services/user.service");
const { createToken, verifyToken } = require("../services/jwt.service");
const { getRecent } = require("../services/expense.service");
const { isGuest } = require("../middlewares/guards");
const { isUser } = require("../middlewares/guards");
const { parseError } = require("../utils/util");
const { validationResult, body } = require("express-validator");
const auth = require("../middlewares/auth");

//TODO: Add home controller
const userRouter = Router();

userRouter.post(
  "/users/register",
  isGuest(),
  body("email")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Email must be at least 10 characters long!")
    .bail()
    .isEmail()
    .withMessage("Email must be a valid email address!"),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long!"),
  body("repass")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords don't match!"),
  async (req, res) => {
    const { email, password, repass } = req.body;

    // Validate input fields using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors: errors.array().map((e) => e.msg), // Return human-readable error messages
        data: { email },
      });
    }

    try {
      const result = await register(email, password);
      const token = createToken(result); // Generate JWT token

      // Set the token as a secure cookie
      res.cookie("token", token);

      // Send success response
      res.status(201).send({
        email: result.email,
        _id: result._id,
        accessToken: token,
      });
    } catch (error) {
      console.error("Registration error:", error);

      // Send error response
      res.status(400).send({
        errors: parseError(error).errors || ["Error during registration"],
        data: { email },
      });
    }
  }
);

userRouter.post(
  "/users/login",
  isGuest(),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const { email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors: errors.array().map((e) => e.msg),
        data: { email },
      });
    }

    try {
      const result = await login(email, password); // Call the login service
      const token = createToken(result); // Generate JWT token

      // Set the token as a cookie
      res.cookie("token", token);

      // Send success response
      res.status(200).send({
        email: result.email,
        _id: result._id,
        accessToken: token,
      });
      console.log("Login successful:", result.email);
    } catch (error) {
      console.error("Login error:", error);

      // Send error response
      res.status(400).send({
        errors: parseError(error).errors || ["Invalid email or password"],
        data: { email },
      });
    }
  }
);

userRouter.get("/users/logout", (req, res) => {
  res.clearCookie("token");
  res.send([]).status(200);
});

userRouter.get("/users/profile", auth, async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    return;
  }
  res.send(user).status(200);
});

module.exports = { userRouter };
