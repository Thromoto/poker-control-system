import ReloadRequest from "../models/ReloadModel.js";
import UserModel from "../models/UserModel.js";

// Rota para recarregar saldo
export async function postReload(req, res) {
  try {
    const { site, value, day } = req.body;

    const reloadRequest = new ReloadRequest({
      site,
      value,
      day,
      status: "PENDING",
      createdBy: req.user.userId,
    });

    await reloadRequest.save();

    res.status(201).send("Reload request saved successfully");
  } catch (error) {
    console.error("Error saving reload request", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para obter todos os pedidos de recarga (reload)
export async function getReloadAll(req, res) {
  try {
    const reloadRequests = await ReloadRequest.find().populate("createdBy");
    res.json(reloadRequests);
  } catch (error) {
    console.error("Error fetching all reload requests", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para um jogador visualizar suas recargas
export async function getReload(req, res) {
  try {
    const reloadRequests = await ReloadRequest.find({
      createdBy: req.user.userId,
    });
    res.json(reloadRequests);
  } catch (error) {
    console.error("Error fetching reload requests", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para administrador visualizar pedidos de recarga
export async function getAdminReload(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const reloadRequests = await ReloadRequest.find().populate("createdBy");
    res.json(reloadRequests);
  } catch (error) {
    console.error("Error fetching reload requests", error);
    res.status(500).send("Internal Server Error");
  }
}

//Rota para Atualizar Status Reload
export async function updateReload(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const requestId = req.params.requestId;
    const { status } = req.body;

    const reloadRequest = await ReloadRequest.findById(requestId);

    if (!reloadRequest) {
      return res.status(404).send("Reload request not found");
    }

    reloadRequest.status = status;
    await reloadRequest.save();

    // Se aprovado, adiciona o valor do lastFinalValue do jogador
    if (status === "APPROVED") {
      const player = await UserModel.findById(reloadRequest.createdBy);
      if (player) {
        const site = reloadRequest.site;
        const approvedValue = reloadRequest.value;

        if (
          player.sites &&
          player.sites[site] &&
          player.sites[site].lastFinalValue !== undefined
        ) {
          if (player.sites[site].lastFinalValue >= 0) {
            player.sites[site].lastFinalValue += approvedValue;
          } else {
            player.sites[site].lastFinalValue = approvedValue; // Definir o valor inicial se for menor que 0
          }
        
          await player.save();
        }
      }
    }

    res.status(200).send("Reload request status updated successfully");
  } catch (error) {
    console.error("Error updating reload request status", error);
    res.status(500).send("Internal Server Error");
  }
}

//Rota admin para deletar reload
export async function deleteReload(req, res) {
  try {
    const requestId = req.params.requestId;

    // Verificar se a solicitação existe
    const reloadRequest = await ReloadRequest.findById(requestId);

    if (!reloadRequest) {
      return res.status(404).send("Reload request not found");
    }

    // Excluir a solicitação
    await ReloadRequest.deleteOne({ _id: requestId });

    res.status(200).send("Reload request deleted successfully");
  } catch (error) {
    console.error("Error deleting reload request", error);
    res.status(500).send("Internal Server Error");
  }
}
