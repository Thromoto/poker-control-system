import mongoose from "mongoose";

const db = mongoose.connect("mongodb://localhost:27017/pokerRAD", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default db;