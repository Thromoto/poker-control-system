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
    888: {
      lastFinalValue: { type: Number, default: 0 },
    },
    ACR: {
      lastFinalValue: { type: Number, default: 0 },
    },
    Bodog: {
      lastFinalValue: { type: Number, default: 0 },
    },
    Chico: {
      lastFinalValue: { type: Number, default: 0 },
    },
    Coin: {
      lastFinalValue: { type: Number, default: 0 },
    },
    IPoker: {
      lastFinalValue: { type: Number, default: 0 },
    },
    Party: {
      lastFinalValue: { type: Number, default: 0 },
    },
    YaPoker: {
      lastFinalValue: { type: Number, default: 0 },
    },
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
