import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const handleLogin = async () => {
    try {
      // Determine o papel/role com base no formato do e-mail
      const role = email.endsWith("@admin.com") ? "admin" : "player";

      // Escolha a URL da API com base no papel/role
      const apiUrl =
        role === "admin"
          ? "http://localhost:3001/api/login-admin"
          : "http://localhost:3001/api/login";

      // Lógica de autenticação com a API
      const response = await axios.post(apiUrl, { email, password });

      // Extraia o token da resposta
      const token = response.data.token;

      // Salve o token no localStorage
      localStorage.setItem("token", token);

      // Redirecionar para a página apropriada
      if (role === "admin") {
        navigate("/admin/adminhome");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed", error);
      if (error.response.status === 401) {
        // Senha inválida
        setInvalidPassword(true);
        setInvalidEmail(false);
      } else if (error.response.status === 404) {
        // E-mail não encontrado
        setInvalidEmail(true);
        setInvalidPassword(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="body-login">
      <div className="container-login">
        <h2 className="login-h2">Login</h2>
        <input
          className="input-login"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        {invalidEmail && (
          <p className="error-message">E-mail não encontrado ou inválido.</p>
        )}
        <input
          className="input-login"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        {invalidPassword && <p className="error-message">Email ou senha inválida.</p>}
        <button className="button-login" onClick={handleLogin}>
          Login
        </button>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p>
          Forgot your password?{" "}
          <Link to="/request-reset-password">Click Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
