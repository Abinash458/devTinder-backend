const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { memberShipAmount } = require("../utils/constants");

router.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;

    const { firstName, lastName, emailId } = req.user;

    // code to create an order on razorpay
    const order = await razorPayInstance.orders.create({
      amount: memberShipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        // all metadata here
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savePayment = await payment.save();

    // return back the order details to frontEnd
    res.json({ ...savePayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {}
});

module.exports = router;
