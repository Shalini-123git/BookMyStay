const { Schema, model } = require("mongoose");

const paymentSchema = new Schema({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    razorpayOrderId: String,
    transactionId: String,
    paymentAmount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Failed"],
        default: "Pending"
    }
}, { timestamps: true });

module.exports  = new model("Payment", paymentSchema);
