const express = require("express");

const { runValidation } = require("../validators/index");
const { isLoggedOut, isLoggedIn, isAdmin } = require("../middlewares/auth");
const { validateCategory } = require("../validators/category");
const {
  handleCreateCategory,
  handleGetAllCategory,
  handleGetCategoryById,
  handleUpdateCategoryById,
  handleDeleteCategory,
} = require("../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidation,
  handleCreateCategory
);

//get category
categoryRouter.get("/", handleGetAllCategory);
categoryRouter.get("/:slug", handleGetCategoryById);

//update category
categoryRouter.put(
  "/:slug",
  isLoggedIn,
  isAdmin,
  validateCategory,
  runValidation,
  handleUpdateCategoryById
);

categoryRouter.delete(
    "/:slug",
    isLoggedIn,
    isAdmin,
    handleDeleteCategory
  );

module.exports = categoryRouter;
