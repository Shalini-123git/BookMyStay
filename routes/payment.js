const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const Booking = require("../models/booking.js");
const Payment = require("../models/payment.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

const getBookingForCurrentUser = async (bookingId, userId) => {
    const booking = await Booking.findById(bookingId).populate("listingId");

    if (!booking) {
        throw new ExpressError(404, "Booking does not exist");
    }

    if (!booking.userId || !booking.userId.equals(userId)) {
        throw new ExpressError(403, "You can only pay for your own bookings");
    }

    return booking;
};

router.get("/:bookingId/checkout", isLoggedIn, wrapAsync(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await getBookingForCurrentUser(bookingId, req.user._id);

    if (booking.bookingStatus === "Cancelled") {
        req.flash("error", "Cancelled bookings cannot be paid");
        return res.redirect("/bookListing/dashboard");
    }

    if (booking.paymentStatus === "Confirmed") {
        req.flash("success", "This booking is already paid");
        return res.redirect("/bookListing/dashboard");
    }

    res.render("../views/payments/checkout.ejs", {
        booking,
        keyId: process.env.RAZORPAY_API_KEY
    });
}));

router.post("/:bookingId/create-order", isLoggedIn, wrapAsync(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await getBookingForCurrentUser(bookingId, req.user._id);

    if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
        return res.status(500).json({
            success: false,
            message: "Razorpay credentials are missing"
        });
    }

    if (booking.bookingStatus === "Cancelled") {
        return res.status(400).json({
            success: false,
            message: "Cancelled bookings cannot be paid"
        });
    }

    if (booking.paymentStatus === "Confirmed") {
        return res.status(400).json({
            success: false,
            message: "This booking is already paid"
        });
    }

    const amountInPaise = Math.round(booking.amount * 100);
    const auth = Buffer
        .from(`${process.env.RAZORPAY_API_KEY}:${process.env.RAZORPAY_API_SECRET}`)
        .toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt: `booking_${booking._id}`,
            notes: {
                bookingId: booking._id.toString(),
                userId: req.user._id.toString()
            }
        })
    });

    const order = await response.json();

    if (!response.ok) {
        return res.status(400).json({
            success: false,
            message: order.error && order.error.description ? order.error.description : "Unable to create payment order"
        });
    }

    await Payment.findOneAndUpdate(
        { bookingId: booking._id },
        {
            bookingId: booking._id,
            userId: req.user._id,
            razorpayOrderId: order.id,
            paymentAmount: booking.amount,
            paymentStatus: "Pending"
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
        success: true,
        order
    });
}));

router.post("/verify", isLoggedIn, wrapAsync(async (req, res) => {
    const {
        bookingId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const booking = await getBookingForCurrentUser(bookingId, req.user._id);
    const payment = await Payment.findOne({ bookingId: booking._id });

    if (!payment || payment.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({
            success: false,
            message: "Payment order does not match this booking"
        });
    }

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    const signatureIsValid = typeof razorpay_signature === "string"
        && generatedSignature.length === razorpay_signature.length
        && crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(razorpay_signature));

    if (!signatureIsValid) {
        await Payment.findOneAndUpdate(
            { bookingId: booking._id },
            { paymentStatus: "Failed" },
            { new: true }
        );

        return res.status(400).json({
            success: false,
            message: "Payment verification failed"
        });
    }

    await Payment.findOneAndUpdate(
        { bookingId: booking._id },
        {
            bookingId: booking._id,
            userId: req.user._id,
            razorpayOrderId: razorpay_order_id,
            transactionId: razorpay_payment_id,
            paymentAmount: booking.amount,
            paymentDate: Date.now(),
            paymentStatus: "Confirmed"
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    booking.bookingStatus = "Confirmed";
    booking.paymentStatus = "Confirmed";
    await booking.save();

    req.flash("success", "Payment successful. Booking confirmed");
    res.json({ success: true });
}));

module.exports = router;
