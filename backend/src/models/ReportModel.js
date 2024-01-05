import mongoose from "mongoose";

const Report = mongoose.model("Report", {
  initialValue: { type: Number },
  finalValue: { type: Number },
  site: String,
  day: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default Report;
