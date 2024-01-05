import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("player");
  const [birthday, setBirthday] = useState("");

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }

      // Determina qual rota usar com base no papel (role)
      const registerRoute =
        role === "admin" ? "/api/register-admin" : "/api/register";

      await axios.post(`http://localhost:3001${registerRoute}`, {
        name,
        lastName,
        email,
        phone,
        birthday,
        street,
        cpf,
        password,
      });
      navigate("/"); // Usando o hook useNavigate
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="body-register">
      <div className="container-register">
        <h2 className="h2-register">Register</h2>
        <div className="input-container">
          <input
            className="input-names"
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-names"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="input-names"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-names"
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="input-names"
            type="text"
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          <input
            className="input-names"
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <input
            className="input-street"
            type="text"
            placeholder="Address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <input
            className="input-names"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="input-names"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <label>
          <div className="radio-group">
            <input
              className="input-register"
              type="radio"
              id="player"
              name="role"
              value="player"
              checked={role === "player"}
              onChange={() => setRole("player")}
            />
            <label htmlFor="player">Player</label>
            <input
              className="input-register"
              type="radio"
              id="admin"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            <label htmlFor="admin">Admin</label>
          </div>
        </label>
        <button className="button-register" onClick={handleRegister}>Register</button>
        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
