import mongoose from "mongoose";

const ReloadRequest = mongoose.model("ReloadRequest", {
  value: { type: Number, default: 0 },
  site: String,
  day: String,
  status: { type: String, default: "PENDING" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default ReloadRequest;
