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
  
    // Filter reports based on the selected site
    const filteredReports = reports.filter(
      (report) => report.site === currentTable
    );
  
    // Calculate totalResult using the filtered reports
    const totalResult = filteredReports.reduce(
      (acc, report) =>
        acc +
        parseFloat(calculateDifference(report.initialValue, report.finalValue)),
      0
    );
  
    return (
      <div>
        <div className="select-player-page">
          <label>
            <select
              className="select-admin-players"
              value={currentTable}
              onChange={(e) => setCurrentTable(e.target.value)}
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
          <div>
            <h3>{`${currentTable}'s Report`} - Total: $ {totalResult}</h3>
            <div className="table-admin-players">
              <table>
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Initial Value</th>
                    <th>Final Value</th>
                    <th>Resultado</th>
                    <th>Day</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.site}</td>
                      <td>$ {report.initialValue}</td>
                      <td>$ {report.finalValue}</td>
                      <td>
                        ${" "}
                        {calculateDifference(
                          report.initialValue,
                          report.finalValue
                        )}
                      </td>
                      <td>{new Date(report.day).toLocaleDateString()}</td>
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
      <div className="container-admin-players">
        <label>
          <select
            className="select-admin-players"
            value={selectedPlayer}
            onChange={(e) => handlePlayerClick(e.target.value)}
          >
            <option key="" value="">
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
            <h3 className="h3-admin-players">{selectedPlayerName}'s Report</h3>
            <div>{renderTablesBySite()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlayersPage;
