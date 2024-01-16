import UserModel from "../models/UserModel.js";
import AdminModel from "../models/AdminModel.js";
import Report from "../models/ReportModel.js";

// Rota protegida para o administrador visualizar dados dos players
export async function getAdminUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    // Consulta todos os usuários (players)
    const players = await UserModel.find({ role: "player" });
    // console.log(players);
    res.json(players);
  } catch (error) {
    console.error("Error fetching player data", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota protegida para o administrador visualizar dados dos admins
export async function getAdmin(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    // Consulta todos os usuários (admins)
    const admin = await AdminModel.find({ role: "admin" });
    // console.log(admin);
    res.json(admin);
  } catch (error) {
    console.error("Error fetching player data", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para administrador excluir admin
export async function deleteAdmin(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const adminId = req.params.adminId;

    const admin = await AdminModel.findByIdAndDelete(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting player", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Rota para administrador editar informações do jogador
export async function editPlayer(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const playerId = req.params.playerId;
    const { name, email, street, cpf, birthday, lastName, phone } = req.body;

    const player = await UserModel.findById(playerId);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Atualiza as informações do jogador
    player.name = name || player.name;
    player.email = email || player.email;
    player.street = street || player.street;
    player.cpf = cpf || player.cpf;
    player.birthday = birthday || player.birthday;
    player.lastName = lastName || player.lastName;
    player.phone = phone || player.phone;

    await player.save();

    res
      .status(200)
      .json({ message: "Player information updated successfully" });
  } catch (error) {
    console.error("Error updating player information", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Rota para administrador excluir jogador
export async function deletePlayer(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const playerId = req.params.playerId;

    const player = await UserModel.findByIdAndDelete(playerId);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Exclua o relatório associado ao jogador
    const deletedReport = await Report.findOneAndDelete({
      createdBy: playerId,
    });

    if (!deletedReport) {
      console.error("Report not found for player:", playerId);
      // Pode tratar isso como um aviso ou tomar outra ação, se necessário
    } else {
      console.log("Report deleted successfully for player:", playerId);
    }

    res.status(200).json({ message: "Player and report deleted successfully" });
  } catch (error) {
    console.error("Error deleting player", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
