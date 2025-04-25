const { Schema, model } = require("mongoose");

const productScheema = new Schema(
  {
      name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "minimum length of Product should be at-least 3 characters"],
      maxlength: [150, "maximum length of Product should be at-least 150 character"],
      },

      slug: {
        type: String,
        required: [true, "Product Slug is required"],
        unique: true,
        lowercase: true,
      },

      description: {
        type: String,
        required: [true, "Product Description is required"],
        trim: true,
        minlength: [3, "minimum length of Product Description should be at-least 3 characters"],
      },

      price: {
        type: Number,
        required: [true, "Product price is required"],
        trim: true,
        validate: {
          validator: v => v>0,
          message: props => props.value + ' is not a valid price. Price must be greater than 0'
        }
      },

      quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        trim: true,
        validate: {
          validator: v => v>0,
          message: props => props.value + ' is not a valid quantity. quantity must be greater than 0'
        }
      },

      sold: {
        type: Number,
        required: [true, "sold quantity is required"],
        trim: true,
        default: 0,
      },

      shiping: {
        type: Number,
        default: 0,
      },

      image: {
      type: String,
    // contentType: String,
      required: [true, "product Image is required"]
      },

      category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true,
        },


  },
  {
    timestams: true,
  }
);

const Product = model('product', productScheema);

module.exports = Product;
