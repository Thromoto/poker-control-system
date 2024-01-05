import mongoose from "mongoose";

const NewWithdraw = mongoose.model("NewWithdraw", {
  player: String,
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  value: { type: Number, default: 0 },
  site: String,
  day: String,
  status: { type: String, default: "PENDING" },
  playerStatus: { type: String, default: "NÃO SAQUEI" }, // Novo campo para o status do jogador
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

export default NewWithdraw;
