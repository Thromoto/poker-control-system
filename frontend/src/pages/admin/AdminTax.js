import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns-tz";

const AdminTax = () => {
  const [taxx, setTaxx] = useState([]);
  const [inicialValue, setInicialValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [day, setDay] = useState(new Date());
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [playersOptions, setPlayerOptions] = useState([]);

  const fetchTax = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/tax", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTaxx(response.data);
    } catch (error) {
      console.error("Error fetching bank", error);
    }
  };

  const findPlayers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/admin/players",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlayerOptions(response.data);
    } catch (error) {
      console.error("Error fetching bank", error);
    }
  };

  const handleSaveTax = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/api/tax",
        {
          inicialValue,
          finalValue,
          tax: finalValue - inicialValue,
          player: selectedPlayer,
          day: day.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInicialValue("");
      setFinalValue("");
      setSelectedPlayer("");
      setDay(new Date());

      fetchTax();
    } catch (error) {
      console.error("Error saving tax", error);
    }
  };

  useEffect(() => {
    fetchTax();
    findPlayers();
  }, [setSelectedPlayer]);

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy", {
      timeZone: "America/Sao_Paulo",
    });
  };

  return (
    <div>
      <h3>Taxas do MetaMask</h3>
      <div className="add-report-form">
        <div className="input-row">
          <label>
            Jogador:
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option key="" value="" disabled>
                Selecione o jogador
              </option>
              {playersOptions.map((player, index) => (
                <option key={index} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Day:
            <input
              type="date"
              value={day.toISOString().split("T")[0]}
              onChange={(e) => setDay(new Date(e.target.value))}
              disabled={
                !selectedPlayer || selectedPlayer === "Escolha seu site"
              }
              className="date-picker"
            />
          </label>
        </div>
        <div className="input-row">
          <label>
            Valor Inicial:
            <input
              className="input-control"
              type="text"
              value={inicialValue}
              onChange={(e) => setInicialValue(e.target.value)}
              disabled={
                !selectedPlayer || selectedPlayer === "Escolha seu site"
              }
            />
          </label>
          <label>
            Valor Final:
            <input
              className="input-control"
              type="text"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              disabled={
                !selectedPlayer || selectedPlayer === "Escolha seu site"
              }
            />
          </label>
        </div>
        <button
          className="button-control"
          onClick={handleSaveTax}
          disabled={!finalValue}
        >
          Save
        </button>
      </div>
      <div className="report-table">
        <table className="table-control">
          <thead>
            <tr>
              <th>Player</th>
              <th>Valor Inicial</th>
              <th>Valor Final</th>
              <th>Taxa</th>
              <th>Day</th>
            </tr>
          </thead>
          <tbody>
            {taxx.map((taxItem) => (
              <tr key={taxItem._id}>
                <td>{taxItem.player}</td>
                <td>$ {taxItem.inicialValue}</td>
                <td>$ {taxItem.finalValue}</td>
                <td>$ {taxItem.finalValue - taxItem.inicialValue}</td>
                <td>{formatDate(taxItem.day)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTax;
