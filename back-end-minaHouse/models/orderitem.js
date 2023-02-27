const mongoose = require("mongoose");
const Product = require("./product");

const orderItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});
/**
 * el 2 steps el gayen y7salo lama y7sal save (post hook)
 * 1- countInStock- quantity
 * 2- update count fl product
 */
orderItemSchema.statics.updateCountInStock = async function (itemId, quantity) {
  const selectedProduct = await Product.findById(itemId);
  // console.log(selectedProduct);
  // console.log(selectedProduct.countInStock);
  const updatedCount = selectedProduct.countInStock - quantity;
  await Product.findByIdAndUpdate(itemId, {
    countInStock: updatedCount,
  });
  console.log(selectedProduct.countInStock);
};

orderItemSchema.post("save", function () {
  this.constructor.updateCountInStock(this.product, this.quantity);
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;