const mongoose = require("mongoose");
const Review = require('./review')
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name must be provided"],
      trim: true,
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product Price must be provided"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Product Description must be provided"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "./upload/example.jpg",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 5,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product Category must be provided"],
    },
    countInStock: {
      type: Number,
      required: [true, "count in stock must be provided"],
      min: [0, "number must be provided"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
ProductSchema.pre('remove', async function(){
  await Review.deleteMany({product: this._id})
})
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", ProductSchema);
