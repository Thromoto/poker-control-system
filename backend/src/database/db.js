import mongoose from "mongoose";
import 'dotenv/config';

const db = mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default db;