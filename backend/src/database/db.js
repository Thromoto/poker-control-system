import mongoose from "mongoose";

const db = mongoose.connect(process.env.MONGODB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default db;