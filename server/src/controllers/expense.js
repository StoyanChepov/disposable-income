const { Router } = require("express");
const { isUser } = require("../middlewares/guards");
const { validationResult, body } = require("express-validator");
const { parseError } = require("../utils/util");
const {
  create,
  getById,
  update,
  deleteById,
  getAttachments,
  addCategory,
  addAttachment,
  addItem,
  getCategories,
  getItems,
  getUnits,
  getItemTypes,
  like,
  createLine,
  updateLine,
  deleteLineById,
} = require("../services/expense.service");
const auth = require("../middlewares/auth");
//TODO: Add home controller
const expenseRouter = Router();

expenseRouter.get("/attachments/:expenseId", auth, async (req, res) => {
  const attachments = await getAttachments(req.params.expenseId);

  if (!attachments) {
    res.status(404);
    return;
  }
  res.send(attachments).status(200);
});

expenseRouter.post(
  "/attachments/create",
  auth,
  body("url")
    .trim()
    .isLength({ min: 1 })
    .withMessage("URL must be at least 1 character long!"),
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must be at least 1 character long!"),
  async (req, res) => {
    try {
      const validation = validationResult(req);
      if (validation.errors.length) {
        return res.status(402).send({ errors: validation.errors });
      }
      if (req.user === undefined && req.user._id === undefined) {
        res
          .status(401)
          .send({ message: "You are not authorized to perform this action!" });
      }

      const result = await addAttachment(
        req.body.expenseId,
        req.body.url,
        req.body.name
      );
      res.send(result).status(200);
    } catch (error) {
      console.log("Error:", error);
      res
        .send({
          errors: parseError(error).errors,
          data: req.body,
        })
        .status(402);
    }
  }
);

expenseRouter.get("/items", auth, async (req, res) => {
  const items = await getItems(req.user._id);
  res.send(items).status(200);
});

expenseRouter.get("/items/units", auth, async (req, res) => {
  const units = await getUnits(req.user._id);
  res.send(units).status(200);
});

expenseRouter.get("/items/types", auth, async (req, res) => {
  const items = await getItemTypes();
  res.send(items).status(200);
});

expenseRouter.post(
  "/items/create",
  auth,
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must be at least 1 character long!"),
  async (req, res) => {
    try {
      const validation = validationResult(req);
      if (validation.errors.length) {
        return res.status(402).send({ errors: validation.errors });
      }
      if (req.user === undefined && req.user._id === undefined) {
        res
          .status(401)
          .send({ message: "You are not authorized to perform this action!" });
      }

      const result = await addItem(req.body.name, req.body.type, req.user._id);
      res.send(result).status(200);
    } catch (error) {
      console.log("Error:", error);
      res
        .send({
          errors: parseError(error).errors,
          data: req.body,
        })
        .status(402);
    }
  }
);

expenseRouter.get("/categories", auth, async (req, res) => {
  //console.log(req.user);
  const categories = await getCategories(req.user._id);
  res.send(categories).status(200);
});

expenseRouter.post(
  "/categories/create",
  auth,
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must be at least 1 character long!"),
  async (req, res) => {
    try {
      const validation = validationResult(req);
      if (validation.errors.length) {
        return res.status(402).send({ errors: validation.errors });
      }
      if (req.user === undefined && req.user._id === undefined) {
        res
          .status(401)
          .send({ message: "You are not authorized to perform this action!" });
      }

      const result = await addCategory(req.body.name, req.user._id);
      res.send(result).status(200);
    } catch (error) {
      console.log("Error:", error);
      res
        .send({
          errors: parseError(error).errors,
          data: req.body,
        })
        .status(402);
    }
  }
);

expenseRouter.post(
  "/expenses/create",
  auth,
  body("id").trim(),
  body("title")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Title must be at least 2 characters long!"),
  body("amount")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Amount must be at least 1 character long!"),
  body("date")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Date must be at least 1 character long!"),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category must be at least 1 character long!"),
  body("type")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Type must be at least 1 character long!"),
  async (req, res) => {
    try {
      const validation = validationResult(req);
      if (validation.errors.length) {
        return res.status(402).send({ errors: validation.errors });
      }
      if (req.user === undefined && req.user._id === undefined) {
        res
          .status(401)
          .send({ message: "You are not authorized to perform this action!" });
      }
      console.log("BODY", req.body);

      const result = await create(req.body, req.user._id);
      console.log("Result", result);

      res.send(result).status(200);
    } catch (error) {
      console.log("Error:", error);
      res
        .send({
          errors: parseError(error).errors,
          data: req.body,
        })
        .status(402);
    }
  }
);

expenseRouter.post(
  "/expenses/create/line",
  auth,
  body("amount")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Amount must be at least 1 character long!"),
  body("quantity")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Quantity must be at least 1 character long!"),
  body("item").trim().notEmpty().withMessage("Item is required!"),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Price must be at least 1 character long!"),
  body("unit").trim().notEmpty().withMessage("Unit is required!"),
  async (req, res) => {
    try {
      const validation = validationResult(req);
      if (!validation.isEmpty()) {
        return res.status(402).send({ errors: validation.errors });
      }

      if (!req.user || !req.user._id) {
        return res
          .status(401)
          .send({ message: "You are not authorized to perform this action!" });
      }

      console.log("BODY:", req.body); // Logs the received payload

      // Example logic to handle the data
      const { item, price, quantity, unit, amount, positionId } = req.body;

      const result = await createLine(req.body, req.user._id);
      console.log("Result", result);

      // Example response
      res.status(201).send({
        message: "Line item created successfully",
        data: { item, price, quantity, unit, amount, positionId },
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ message: "Server error occurred!" });
    }
  }
);

expenseRouter.put(
  "/expenses/update/line/:id",
  auth,
  body("id").trim(),
  body("amount")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Amount must be at least 1 character long!"),
  body("quantity")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Quantity must be at least 1 character long!"),
  body("item"),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Price must be at least 1 character long!"),
  body("unit"),
  async (req, res) => {
    try {
      const validation = validationResult(req);
      if (validation.errors.length) {
        return res.status(402).send({ errors: validation.errors });
      }
      const itemPositionId = req.params.id;
      if (req.user === undefined && req.user._id === undefined) {
        res
          .status(401)
          .send({ message: "You are not authorized to perform this action!" });
      }
      console.log("BODY", req.body);

      const result = await updateLine(itemPositionId, req.body, req.user._id);
      console.log("Result", result);

      res.send(result).status(200);
    } catch (error) {
      console.log("Error:", error);
      res
        .send({
          errors: parseError(error).errors,
          data: req.body,
        })
        .status(402);
    }
  }
);

expenseRouter.put(
  "/expenses/:id",
  auth,
  body("title")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Title must be at least 2 characters long!"),
  body("amount")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Amount must be at least 1 character long!"),
  body("date")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Date must be at least 1 character long!"),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category must be at least 1 character long!"),
  async (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user._id;
    try {
      const validation = validationResult(req);
      if (validation.errors.length) {
        return res.status(402).send({ errors: validation.errors });
      }
      if (req.user === undefined && req.user._id === undefined) {
        res
          .status(401)
          .send({ message: "You are not authorized to perform this action!" });
      }
      const result = await update(expenseId, req.body, userId);
      res.send(result).status(200);
    } catch (error) {
      console.log("Error:", error);
      res.send({
        errors: parseError(error).errors,
        data: req.body,
      });
    }
  }
);

expenseRouter.delete("/expenses/:id", auth, async (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user._id;
  try {
    const result = await deleteById(expenseId, userId);
    res.send(result).status(200);
  } catch (error) {
    console.log("Error:", error);
    res.send({
      errors: parseError(error).errors,
    });
  }
});

expenseRouter.delete("/expenses/delete/line/:id", auth, async (req, res) => {
  const itemPosId = req.params.id;
  const userId = req.user._id;
  try {
    const result = await deleteLineById(itemPosId, userId);
    res.send(result).status(200);
  } catch (error) {
    console.log("Error:", error);
    res.send({
      errors: parseError(error).errors,
    });
  }
});

module.exports = { expenseRouter };
