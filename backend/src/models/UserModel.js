import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: Number,
  birthday: String,
  street: String,
  cpf: String,
  password: String,
  role: { type: String, default: "player" },
  sites: {
    Chico: {
      lastFinalValue: { type: Number, default: 0 },
    },
    Party: {
      lastFinalValue: { type: Number, default: 0 },
    },
    ACR: {
      lastFinalValue: { type: Number, default: 0 },
    },
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
