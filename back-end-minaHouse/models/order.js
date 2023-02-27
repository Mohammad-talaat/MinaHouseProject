const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    address: {
      street: {
        type: String,
        required: [true, "street must be provided"],
      },
      city: {
        type: String,
        required: [true, "city must be provided"],
      },
    },
    phone: {
      type: String,
      required: [true, "phone number must be provided"],
      validate: {
        validator: function (v) {
          return /^01[0|1|2|5][0-9]{8}$/.test(v);
        },
        message: "Enter a valid phone number",
      },
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    user: {
      required:true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

orderSchema.methods.calcTotalPrice = async function () {
  return await Order.aggregate([
    {
      $match: {
        _id: this._id,
      },
    },
    {
      $unwind: {
        path: "$orderItems",
      },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "orderItems",
        foreignField: "_id",
        as: "order",
      },
    },
    {
      $unwind: {
        path: "$order",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "order.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $unwind: {
        path: "$productInfo",
      },
    },
    {
      $project: {
        total: {
          $multiply: ["$productInfo.price", "$order.quantity"],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalPrice: {
          $sum: "$total",
        },
      },
    },
  ]);
};

// TO update DB with the new value
orderSchema.methods.updateTotalPrice = async function (total) {
  return await Order.findOneAndUpdate(
    { _id: this._id },
    { totalPrice: total[0].totalPrice },
    { new: true }
  );
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;