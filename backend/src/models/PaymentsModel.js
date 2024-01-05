import mongoose from "mongoose";

const Payments = mongoose.model("Payments", {
  value: { type: Number, default: 0 },
  day: String,
  status: { type: String, default: "PENDING" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default Payments;
