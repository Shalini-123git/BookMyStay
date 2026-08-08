const { Schema, model } = require("mongoose");

const bookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    listingId: {
        type: Schema.Types.ObjectId,
        ref: "Listing"
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    note: String,
    pricePerNight: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ["pending", "Confirmed", "Cancelled"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
}, { timestamps: true });

module.exports = new model("Booking", bookingSchema);
