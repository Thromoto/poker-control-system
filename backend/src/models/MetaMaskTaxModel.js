import mongoose from "mongoose";

const MetaMaskTax = mongoose.model("MetaMask", {
  day: String,
  inicialValue: { type: Number, default: 0 },
  finalValue: { type: Number, default: 0 },
  tax: String,
  player: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

export default MetaMaskTax;
