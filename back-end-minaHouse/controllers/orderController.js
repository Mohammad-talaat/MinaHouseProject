const Order = require("../models/order");
const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("../errors");
const OrderItem = require("../models/orderitem");
const { sendEmail } = require("../utils/sendEmail");

const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("orderItems").populate({path:'orderItems', populate:{path:'product', select:'name image price'}})
    .populate({path:"user", select:'name email'});
 
  res.status(StatusCodes.OK).json(orders);
};

const updateOrder = async (req, res) => {
  const {user} = req.body
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
   
  if (!order) {
    throw new CustomApiError.BadRequestError("No Order Found");
  }
const html = `<h3>We are pleased to inform you that your order is confirmed and will be dilevered within 3 days.</h3>`
  sendEmail(user.name, user.email, 'Order Confirmation',html)

  res.status(StatusCodes.OK).json(order);
};

const createOrder = async (req, res) => {
  // await OrderItem.deleteMany();
  // await Order.deleteMany();

  /*
    1- array of order items
    2- store order items db
    3- array of order items id
    4- store ids ka ref fl order 
 */
  // console.log(req.body.orderItems);
  const { orderItems } = req.body;
  const itemsId = [];
  for (const item of orderItems) {
    newItem = await OrderItem.create(item);
    itemsId.push(newItem._id);
  }
  // console.log(itemsId);
  // res.json(itemsId);

  const { address, phone } = req.body;
  const order = {
    orderItems: itemsId,
    address,
    phone,
    user: req.user.userId,
  };
  const newOrder = await Order.create(order);
  const total = await newOrder.calcTotalPrice();
  const updatedTotalPrice = await newOrder.updateTotalPrice(total);

  res.status(StatusCodes.CREATED).json({ order: updatedTotalPrice });
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder
};
/*TODO
1- featured
2- reflect countInStock DONE
3- update talama el order pending 
*/
