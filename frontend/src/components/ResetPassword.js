import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import "./ResetPassword.css";

import home from "./home.png";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleResetPassword = async () => {
    try {
      if (confirmNewPassword !== newPassword) {
        setPasswordsMatch(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/reset-password",
        { token, newPassword }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div className="body-master">
      <div className="body-reset">
      <Link to="/">
          <img className="home-icon" src={home} alt="Home" />
        </Link>
        <h2>Redefinir Senha</h2>
        <input
          type="password"
          placeholder="Digite sua nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirme sua senha"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        {!passwordsMatch && <p className="error-message">As senhas não coincidem.</p>}
        <button className="button-reset" onClick={handleResetPassword}>Redefinir Senha</button>
        <br />
      </div>
    </div>
  );
};

export default ResetPassword;