import mongoose from "mongoose";

const db = mongoose.connect("mongodb+srv://thiomoto:kgrALDlfrjgjlyRl@thro.ulm8lpp.mongodb.net/?retryWrites=true&w=majority&appName=thro", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default db;