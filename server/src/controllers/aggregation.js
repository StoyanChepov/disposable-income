const { Router } = require("express");
const { isUser } = require("../middlewares/guards");
const { validationResult, body } = require("express-validator");
const { parseError } = require("../utils/util");
const {
  getAllByCategory,
  getAllByDate,
} = require("../services/expense.service");
const auth = require("../middlewares/auth");

//TODO: Add home controller
const aggregationRouter = Router();

aggregationRouter.get("/aggregation", auth, async (req, res) => {
  const chartId = req.query.chartId;
  console.log("ChartId: ", chartId);
  const type = req.query.type;

  //console.log(req.user);
  let aggregation = null;
  if (chartId == 1) {
    aggregation = await getAllByCategory(type, req.user._id);
  } else if (chartId == 2) {
    aggregation = await getAllByDate(type, req.user._id);
  }
  if (!aggregation) {
    res.status(404);
    return;
  }

  res.send(aggregation).status(200);
});

module.exports = { aggregationRouter };
