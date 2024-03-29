import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns-tz";

import "../../styles/Reload.css";

const Reload = () => {
  const [selectedSite, setSelectedSite] = useState("");
  const [value, setValue] = useState("");
  const [day, setDay] = useState(new Date());
  const [showWarning, setShowWarning] = useState(false);
  const [siteOptions, setSiteOptions] = useState([
    "Escolha seu site",
    "888",
    "ACR",
    "Bodog",
    "Chico",
    "Coin",
    "IPoker",
    "Party",
    "YaPoker",
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
      // Verifica se o valor é um número inteiro ou com ponto
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        console.error(
          "Valor inválido. Insira um número inteiro ou com até dois decimais."
        );
        setShowWarning(true);
        return;
      }

      setShowWarning(false);

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
      setDay(new Date());
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
      <h1 className="h1-reload">Reload Requests</h1>
      <div className="container-reload">
        <div className="inputs-reloads">
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
            Data:
            <input
              type="date"
              value={day.toISOString().split("T")[0]}
              onChange={(e) => setDay(new Date(e.target.value))}
              disabled={!selectedSite || selectedSite === "Escolha seu site"}
            />
          </label>
          <label>
            Valor:
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setShowWarning(false); // Esconde o aviso ao começar a digitar novamente
              }}
              disabled={!selectedSite || selectedSite === "Escolha seu site"}
            />
            {showWarning && (
              <p style={{ color: "red", marginTop: "2px" }}>
                *Insira um número (ex: 150 ou 150.45)
              </p>
            )}
          </label>
          <button onClick={handleReload} disabled={!value}>
            Recarregar
          </button>
        </div>
        <div className="resumo-reload1">
          <h2>Resumo das Recargas</h2>
          <h4>Total: $ {totalReload().toFixed(2)}</h4>
          <div className="resumo-reload">
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
                    <td>$ {request.value}</td>
                    <td>{formatDate(request.day)}</td>
                    <td>{request.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reload;
