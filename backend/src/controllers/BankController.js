import BankModel from "../models/BankModel.js";

// Rota para buscar os bancos
export async function getBanck(req, res) {
  try {
    const banks = await BankModel.find({ createdBy: req.user.userId });
    res.json(banks);
  } catch (error) {
    console.error("Error fetching banks", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para salvar um novo banco
export async function saveBank(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const { value, bankName, day } = req.body;

    // Crie um novo relatório associado ao usuário autenticado
    const newBank = new BankModel({
      bankName,
      value,
      day,
      createdBy: req.user.userId,
    });

    // Salve o banco no banco de dados
    await newBank.save();

    res.status(201).send("Bank saved successfully");
  } catch (error) {
    console.error("Error saving bank", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para atualizar um valor de banco específico
export async function editBanck(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const { value, day } = req.body;

    // Encontre o banco pelo ID
    const bank = await BankModel.findById(req.params.id);

    // Se o banco não existir, retorne um erro 404
    if (!bank) {
      return res.status(404).send("Bank not found");
    }

    // Atualize os campos necessários
    bank.value = value;
    bank.day = day;

    // Salve as alterações
    await bank.save();

    // Responda com os dados atualizados
    res.json(bank);
  } catch (error) {
    console.error("Error updating bank", error);
    res.status(500).send("Internal Server Error");
  }
}
