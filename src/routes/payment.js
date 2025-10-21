const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { memberShipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get["x-Razorpay-Signature"];
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ message: "Webhook signature is invalid!" });
    }

    // Update my payment status in DB

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    // Update the user as Premium
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay. (IMP)
    return res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
