import React, { useState, useEffect } from "react";
import axios from "axios";

import "./AdminPlayersPage.css";

const AdminPlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [reports, setReports] = useState([]);
  const [selectedPlayerName, setSelectedPlayerName] = useState("");
  const [currentTable, setCurrentTable] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3001/api/admin/players", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPlayers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching player data", error);
      });
  }, []);

  const fetchPlayerReports = (playerId) => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3001/api/admin/players/${playerId}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReports(response.data);
      })
      .catch((error) => {
        console.error("Error fetching player reports", error);
      });
  };

  const calculateDifference = (initialValue, finalValue) => {
    const initial = parseFloat(initialValue);
    const final = parseFloat(finalValue);

    if (!isNaN(initial) && !isNaN(final)) {
      return final - initial;
    }

    return "N/A";
  };

  const handlePlayerClick = (playerId) => {
    const selectedPlayer = players.find((player) => player._id === playerId);
    setSelectedPlayer(selectedPlayer?._id);
    setSelectedPlayerName(selectedPlayer?.name);
    fetchPlayerReports(playerId);
  };

  const renderTablesBySite = () => {
    const uniqueSites = Array.from(
      new Set(reports.map((report) => report.site))
    );

    return (
      <div>
        <div className="selectt">
          <label>
            {/* Escolha o site: */}
            <select
              value={currentTable}
              onChange={(e) => setCurrentTable(e.target.value)}
              className="select-control"
            >
              <option value="">Selecione um site</option>
              {uniqueSites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </label>
        </div>
        {currentTable && (
          <div className="table-container">
            <h3 className="h3-control">{`Reports for Site ${currentTable}`}</h3>
            <div className="report-table-control">
              <table className="table-control">
                <thead>
                  <tr>
                    <th>Site</th>
                    <th className="report-initial-value">Initial Value</th>
                    <th className="report-final-value">Final Value</th>
                    <th className="report-result">Resultado</th>
                    <th className="report-day">Day</th>
                  </tr>
                </thead>
                <tbody>
                  {reports
                    .filter((report) => report.site === currentTable)
                    .map((report) => (
                      <tr key={report._id} className="report-row">
                        <td>{report.site}</td>
                        <td className="report-initial-value">
                          $ {report.initialValue}
                        </td>
                        <td className="report-final-value">
                          $ {report.finalValue}
                        </td>
                        <td className="report-result">
                          ${" "}
                          {calculateDifference(
                            report.initialValue,
                            report.finalValue
                          )}
                        </td>
                        <td className="report-day">
                          {new Date(report.day).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="body-admin-players">
      <h1>Players Report</h1>
      <label>
        Player:
        <select
          value={selectedPlayer}
          onChange={(e) => handlePlayerClick(e.target.value)}
        >
          <option key="" value="" disabled>
            Selecione o jogador
          </option>
          {players.map((player) => (
            <option key={player._id} value={player._id}>
              {player.name}
            </option>
          ))}
        </select>
      </label>
      {selectedPlayer && (
        <div>
          <h3 className="h3-control">{selectedPlayerName}</h3>
          <div>{renderTablesBySite()}</div>
        </div>
      )}
    </div>
  );
};

export default AdminPlayersPage;
