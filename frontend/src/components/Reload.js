import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { format } from "date-fns-tz";

import "react-datepicker/dist/react-datepicker.css";
import "./Reload.css";

const Reload = () => {
  const [selectedSite, setSelectedSite] = useState("");
  const [value, setValue] = useState("");
  const [day, setDay] = useState(new Date());
  const [siteOptions, setSiteOptions] = useState([
    "Escolha seu site",
    "Chico",
    "Party",
    "ACR",
  ]);
  const [reloadRequests, setReloadRequests] = useState([]);

  useEffect(() => {
    // Carregar as recargas do jogador ao montar o componente
    fetchReloadRequests();
  }, []);

  const fetchReloadRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/reload-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReloadRequests(response.data);
    } catch (error) {
      console.error("Error fetching reload requests", error);
    }
  };

  const totalReload = () => {
    // Filtra os pedidos de saque com status "APPROVED"
    const approvedReloads = reloadRequests.filter(
      (reload) => reload.status === "APPROVED"
    );

    // Calcula a soma dos valores aprovados
    const total = approvedReloads.reduce(
      (acc, reload) => acc + parseFloat(reload.value),
      0
    );

    return total;
  };

  const handleReload = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/api/reload",
        {
          site: selectedSite,
          value: parseFloat(value), // Certifique-se de que o valor seja enviado como número
          day: day.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setValue("");
      setSelectedSite("");

      // Após enviar a solicitação, recarregar as recargas do jogador
      fetchReloadRequests();
    } catch (error) {
      console.error("Error reloading", error);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm:ss", {
      timeZone: "America/Sao_Paulo",
    });
  };

  return (
    <div className="body-reload">
      <h1>Recarga de Saldo</h1>
      <label>
        Site:
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
        >
          {siteOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label>
        Valor:
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <label>
        Data:
        <DatePicker
          selected={day}
          onChange={(date) => setDay(date)}
          dateFormat="dd/MM/yyyy"
          disabled={!selectedSite || selectedSite === "Escolha seu site"}
          className="date-picker"
        />
      </label>
      <button onClick={handleReload}>Recarregar</button>
      <h4>Total: {totalReload()}</h4>
      <div>
        <h2>Resumo das Recargas</h2>
        <table>
          <thead>
            <tr>
              <th>Site</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reloadRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.site}</td>
                <td>{request.value}</td>
                <td>{formatDate(request.day)}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reload;
