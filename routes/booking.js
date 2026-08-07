const express = require("express");
const Listing = require("../models/listing.js");
const router = express.Router();
const Booking = require("../models/booking.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

router.get("/dashboard", isLoggedIn, wrapAsync(async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id })
        .populate("listingId")
        .sort({ createdAt: -1 });

    res.render("../views/bookings/dashboard.ejs", { bookings });
}));

router.patch("/:bookingId/cancel", isLoggedIn, wrapAsync(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ExpressError(404, "Booking does not exist");
    }

    if (!booking.userId || !booking.userId.equals(req.user._id)) {
        req.flash("error", "You can only cancel your own bookings");
        return res.redirect("/bookListing/dashboard");
    }

    if (booking.bookingStatus === "Cancelled") {
        req.flash("error", "This booking is already cancelled");
        return res.redirect("/bookListing/dashboard");
    }

    booking.bookingStatus = "Cancelled";
    booking.paymentStatus = "Cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled successfully");
    res.redirect("/bookListing/dashboard");
}));

router.get("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("../views/bookings/new.ejs", { listing });
}));

router.post("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing does not exist");
    }

    const { checkIn, checkOut, guests, note } = req.body.booking;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
        req.flash("error", "Check-out date must be after check-in date");
        return res.redirect(`/bookListing/${id}`);
    }

    const existingBooking = await Booking.findOne({
        listingId: listing._id,
        bookingStatus: { $ne: "Cancelled" },
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate }
    });

    if (existingBooking) {
        req.flash("error", "This stay is already booked for the selected dates");
        return res.redirect(`/bookListing/${id}`);
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const totalNights = Math.ceil((checkOutDate - checkInDate) / oneDay);
    const amount = totalNights * listing.price;

    const newBooking = new Booking({
        userId: req.user._id,
        listingId: listing._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        note,
        pricePerNight: listing.price,
        amount,
        bookingStatus: "pending",
        paymentStatus: "Pending"
    });

    await newBooking.save();
    req.flash("success", "Booking saved successfully");
    res.redirect(`/payments/${newBooking._id}/checkout`);
}));

module.exports = router;
