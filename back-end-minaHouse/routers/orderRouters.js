const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrder
} = require("../controllers/orderController");
const {authorizePermissions,authenticateUser}= require('../middleware/authentication')
router.route("/").get(authenticateUser,authorizePermissions('admin','owner'),getAllOrders).post(createOrder);
router.route("/:id").patch(authenticateUser,authorizePermissions('admin','owner'),updateOrder);

module.exports = router;
