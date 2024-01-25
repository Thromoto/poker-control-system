import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../../styles/RequestResetPassword.css";

import home from "../../images/home.png";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);

  const handleRequestReset = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/request-reset-password",
        { email }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response.data.error);
      if (error.response.status === 404) {
        setInvalidEmail(true);
      } else {
        setInvalidEmail(false);
      }
    }
  };

  return (
    <div className="body-master">
      <div className="body-request">
        <Link to="/">
          <img className="home-icon" src={home} alt="Home" />
        </Link>
        <h2>Solicitar redefinição de senha</h2>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {invalidEmail && (
          <p className="error-message">E-mail não encontrado ou inválido.</p>
        )}
        <button className="button-request" onClick={handleRequestReset}>
          Solicitar Redefinição
        </button>
        <br />
      </div>
    </div>
  );
};

export default RequestResetPassword;
