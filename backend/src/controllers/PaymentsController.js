import Payments from "../models/PaymentsModel.js";

// Rota para pagamentos
export async function postPayments(req, res) {
  try {
    const { value, day } = req.body;

    const paymentRequest = new Payments({
      value,
      day,
      status: "PENDING",
      createdBy: req.user.userId,
    });

    await paymentRequest.save();

    res.status(201).send("Payment request saved successfully");
  } catch (error) {
    console.error("Error saving Payment request", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para um jogador visualizar seus pagamentos
export async function getPayments(req, res) {
  try {
    const paymentRequests = await Payments.find({
      createdBy: req.user.userId,
    });
    res.json(paymentRequests);
  } catch (error) {
    console.error("Error fetching payment requests", error);
    res.status(500).send("Internal Server Error");
  }
}

// Rota para administrador visualizar pedidos de pagamento
export async function getAdminPayments(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const paymentRequests = await Payments.find().populate("createdBy");
    res.json(paymentRequests);
  } catch (error) {
    console.error("Error fetching payment requests", error);
    res.status(500).send("Internal Server Error");
  }
}

//Rota para Atualizar Status Payment
export async function adminEditPayments(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send("Forbidden");
    }

    const requestId = req.params.requestId;
    const { status } = req.body;

    const paymentRequest = await Payments.findById(requestId);

    if (!paymentRequest) {
      return res.status(404).send("Payment request not found");
    }

    paymentRequest.status = status;
    await paymentRequest.save();

    res.status(200).send("Payment request status updated successfully");
  } catch (error) {
    console.error("Error updating reload payment status", error);
    res.status(500).send("Internal Server Error");
  }
}
