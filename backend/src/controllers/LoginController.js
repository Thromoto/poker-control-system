import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import UserModel from "../models/UserModel.js";
import AdminModel from "../models/AdminModel.js";

export async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, "secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function postRegister(req, res) {
  try {
    const { name, email, password, street, cpf, birthday, lastName, phone } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      lastName,
      email,
      phone,
      birthday,
      street,
      cpf,
      password: hashedPassword,
    });

    await user.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Rota para administrador
export async function postRegisterAdmin(req, res) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new AdminModel({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(200).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: admin._id, role: "admin" }, "secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Rota para solicitar redefinição de senha
export async function requestReset(req, res) {
  const { email } = req.body;

  try {
    // Verifique se o e-mail existe no banco de dados
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Crie e envie o token por e-mail
    const token = jwt.sign({ userId: user.id }, "secret-key", {
      expiresIn: "1h",
    });

    // Configurar o transporte de e-mail com OAuth2
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "788f9b743730f4",
        pass: "ba12c1e2481de8",
      },
    });

    const resetPasswordLink = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
      from: "788f9b743730f4",
      to: user.email,
      subject: "Redefinição de Senha",
      text: `Clique no link a seguir para redefinir sua senha: ${resetPasswordLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "E-mail enviado com sucesso" });
  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// Rota para redefinir a senha
export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  try {
    // Verificar o token
    const decoded = jwt.verify(token, "secret-key");

    // Encontrar o usuário com base no ID no token (substitua com uma lógica real)
    const user = await UserModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Atualizar a senha no banco de dados (bcrypt gera automaticamente um novo hash)
    user.password = bcrypt.hashSync(newPassword, 10);

    await user.save(); // Salvar as alterações no banco de dados

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
}
