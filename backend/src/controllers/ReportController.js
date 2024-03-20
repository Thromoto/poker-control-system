import Report from "../models/ReportModel.js";
import UserModel from "../models/UserModel.js";
import moment from 'moment-timezone';

// Rota para buscar relatórios
export async function getReport(req, res) {
  try {
    const reports = await Report.find({ createdBy: req.user.userId });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para salvar relatório
export async function saveReport(req, res) {
  try {
    const { initialValue, finalValue, site, day } = req.body;

    const user = await UserModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verifica se o site específico já existe em user.sites
    if (!user.sites[site]) {
      // Se não existir, cria um objeto vazio para o site
      user.sites[site] = {};
    }

    // Verificar se o jogador já fez um relatório para este site hoje
    const lastReport = await Report.findOne({
      createdBy: req.user.userId,
      site: site,
      day: day
    });

    if (lastReport) {
      return res.status(403).json({ error: "You have already reported results for this site today" });
    }

    // Obtém o último valor final do site a partir do lastFinalValue ou define como initialValue se não existir
    const lastFinalValue = user.sites[site].lastFinalValue || initialValue;

    // Atualiza o lastFinalValue do site específico
    user.sites[site].lastFinalValue = finalValue;

    // Crie um novo relatório associado ao usuário autenticado
    const newReport = new Report({
      initialValue: lastFinalValue,
      finalValue,
      site,
      day,
      createdBy: req.user.userId,
    });

    // Salve o relatório no banco de dados
    await newReport.save();

    // Salva as alterações no lastFinalValue
    await user.save();

    res.status(201).send("Report saved successfully");
  } catch (error) {
    console.error("Error saving report", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para buscar relatórios (para administradores)
export async function getAdminReport(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports", error);
    res.status(500).send("Internal Server Error");
  }
}

// Modifique a rota para buscar relatórios do jogador específico
export async function getReportIdPlayer(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const playerId = req.params.playerId;

    // Consulta relatórios associados ao jogador específico
    const reports = await Report.find({ createdBy: playerId });

    res.json(reports);
  } catch (error) {
    console.error("Error fetching player reports", error);
    res.status(500).send("Internal Server Error");
  }
}
