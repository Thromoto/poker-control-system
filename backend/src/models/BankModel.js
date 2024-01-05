import mongoose from "mongoose";

const BankModel = mongoose.model("Bank", {
  day: String,
  value: { type: Number, default: 0 },
  bankName: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

export default BankModel;
