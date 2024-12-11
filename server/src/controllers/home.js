const { Router } = require("express");
const {
  getAll,
  getRecent,
  getById,
  getItemPosById,
  searchExpense,
} = require("../services/expense.service");

const auth = require("../middlewares/auth");
//TODO: Add home controller
const homeRouter = Router();

homeRouter.get("/expenses", auth, async (req, res) => {
  //console.log(req.user);
  const expenses = await getAll(req.user._id);
  res.send(expenses).status(200);
});

homeRouter.get("/expenses/:id", async (req, res) => {
  //console.log(req.user);
  const expense = await getById(req.params.id);

  if (!expense) {
    res.status(404);
    return;
  }
  res.send(expense).status(200);
  /*
  const isOwner = req.user && req.user._id == expense.createdBy.toString();
  const hasLiked = Boolean(
    req.user && expense.recommendList.find((l) => l.toString() == req.user._id)
  );
  const recommendations = expense.recommendList.length;
  res.render("details", { expense, isOwner, hasLiked, recommendations });
  */
});

homeRouter.get("/expenses/line/:id", async (req, res) => {
  //console.log(req.user);
  console.log('req.params.id', req.params.id);

  const itemPos = await getItemPosById(req.params.id);

  if (!itemPos) {
    res.status(404);
    return;
  }
  res.send(itemPos).status(200);
});

homeRouter.get("/search", async (req, res) => {
  const { search } = req.query;
  let expenses = [];
  expenses = await searchExpense(search);

  res.render("search", { data: { search }, expenses });
});

module.exports = { homeRouter };
