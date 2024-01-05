import NewWithdraw from "../models/WithdrawModel.js";
import UserModel from "../models/UserModel.js";

// Rota para obter todos os pedidos de saque (withdraw)
export async function getAllWithdraw(req, res) {
  try {
    const withdrawRequests = await NewWithdraw.find().populate("createdBy");
    res.json(withdrawRequests);
  } catch (error) {
    console.error("Error fetching all withdraw requests", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function saveWithdraw(req, res) {
  try {
    const { playerId, site, value, day } = req.body;

    const withdrawRequest = new NewWithdraw({
      playerId,
      site,
      value,
      day,
      status: "PENDING",
      playerStatus: "NÃO SAQUEI", // Novo campo para o status do jogador
      createdBy: req.user.userId,
    });

    await withdrawRequest.save();

    res.status(201).send("Withdraw request saved successfully");
  } catch (error) {
    console.error("Error saving withdraw request", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getWithdraw(req, res) {
  try {
    const playerId = req.user.userId;

    const withdrawRequests = await NewWithdraw.find({ playerId });
    res.json(withdrawRequests);
  } catch (error) {
    console.error("Error fetching withdraw requests", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getAdminWithdraw(req, res) {
  try {
    const withdrawRequests = await NewWithdraw.find().populate("playerId");
    res.json(withdrawRequests);
  } catch (error) {
    console.error("Error fetching withdraw requests", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function updateAdminWithdrawStatus(req, res) {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;

    const withdrawRequest = await NewWithdraw.findById(requestId);

    if (!withdrawRequest) {
      return res.status(404).send("Withdraw request not found");
    }

    withdrawRequest.status = status;
    await withdrawRequest.save();

    // Se aprovado, adiciona o valor do lastFinalValue do jogador
    if (status === "APPROVED") {
      const player = await UserModel.findById(withdrawRequest.playerId);
      if (player) {
        const site = withdrawRequest.site;
        const approvedValue = withdrawRequest.value;

        if (
          player.sites &&
          player.sites[site] &&
          player.sites[site].lastFinalValue
        ) {
          // Subtrai o valor aprovado do lastFinalValue do site correspondente
          player.sites[site].lastFinalValue -= approvedValue;

          await player.save();
        }
      }
    }

    res.status(200).send("Withdraw request status updated successfully");
  } catch (error) {
    console.error("Error updating withdraw request status", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function updateWithdrawStatus(req, res) {
  try {
    const playerId = req.user.userId;
    const withdrawId = req.params.withdrawId;

    const withdrawRequest = await NewWithdraw.findById(withdrawId);

    if (!withdrawRequest || withdrawRequest.playerId.toString() !== playerId) {
      return res.status(404).send("Withdraw request not found");
    }

    // Atualiza o status do jogador para "SACADO"
    withdrawRequest.playerStatus = "SACADO";
    await withdrawRequest.save();

    res.status(200).send("Player status updated successfully");
  } catch (error) {
    console.error("Error updating player status", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para excluir uma solicitação de saque
export async function deleteWithdraw(req, res) {
  try {
    const requestId = req.params.requestId;

    // Verificar se a solicitação existe
    const withdrawRequest = await NewWithdraw.findById(requestId);

    if (!withdrawRequest) {
      return res.status(404).send("Withdraw request not found");
    }

    // Excluir a solicitação
    await NewWithdraw.deleteOne({ _id: requestId });

    res.status(200).send("Withdraw request deleted successfully");
  } catch (error) {
    console.error("Error deleting withdraw request", error);
    res.status(500).send("Internal Server Error");
  }
}
