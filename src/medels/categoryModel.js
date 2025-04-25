
const { Schema, model } = require("mongoose");

const categoryScheema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [3, "minimum length of category is 3"],
    },
    slug: {
        type: String,
        required: [true, "Category name is required"],
        lowercase:true,
        unique: true,
        minlength: [3, "minimum length of category is 3"],
      },
  },
  {
    timestams: true,
  }
);

const Category = model('category', categoryScheema);

module.exports = Category;
