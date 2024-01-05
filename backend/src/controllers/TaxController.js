import MetaMaskTax from "../models/MetaMaskTaxModel.js";

// Rota para buscar as taxas
export async function getTax(req, res) {
  try {
    const taxs = await MetaMaskTax.find({ createdBy: req.user.userId });
    res.json(taxs);
  } catch (error) {
    console.error("Error fetching taxs", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para salvar uma nova taxa
export async function saveNewTax(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const { inicialValue, finalValue, tax, day, player } = req.body;

    // Crie um novo relatório associado ao usuário autenticado
    const newTax = new MetaMaskTax({
      inicialValue,
      finalValue,
      tax,
      player,
      day,
      createdBy: req.user.userId,
    });

    // Salve a taxa no banco de dados
    await newTax.save();

    res.status(201).send("Tax saved successfully");
  } catch (error) {
    console.error("Error saving tax", error);
    res.status(500).send("Internal Server Error");
  }
}
