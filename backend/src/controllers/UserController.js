import jwt from "jsonwebtoken";

import UserModel from '../models/UserModel.js'

// recebe dados do user
export default async function getUser(req, res) {
  try {
    console.log("Recebida solicitação para /api/user");

    const token = req.headers.authorization.split(" ")[1]; // Obtém o token do cabeçalho
    console.log("Token recebido:", token); // Adiciona este console para verificar o token recebido.

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    const decodedToken = jwt.verify(token, "secret-key");
    console.log("Token decodificado:", decodedToken); // Adiciona este console para verificar o token decodificado.

    const user = await UserModel.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Usuário encontrado:", user);

    // Retorna as informações específicas do usuário que você deseja
    res.status(200).json({ name: user.name, email: user.email, sites: user.sites });
  } catch (error) {
    console.error("Erro ao processar solicitação:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
