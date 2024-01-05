import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

import "./AdminPlayersPage.css";

const AdminPlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedPlayerName, setSelectedPlayerName] = useState("");

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

  const totalResult = () => {
    return reports.reduce(
      (acc, report) =>
        acc +
        parseFloat(calculateDifference(report.initialValue, report.finalValue)),
      0
    );
  };

  const handlePlayerClick = (playerId) => {
    const selectedPlayer = players.find((player) => player._id === playerId);
    setSelectedPlayer(selectedPlayer?._id);
    setSelectedPlayerName(selectedPlayer?.name);
    fetchPlayerReports(playerId);
  };

  return (
    <div className="body-admin-players">
      <h2>Players Data (Admin)</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player._id} onClick={() => handlePlayerClick(player._id)}>
              <td>{player.name}</td>
              <td>{player.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPlayer && (
        <div>
          <h3>
            Reports for {selectedPlayerName} - Total: {totalResult()}
          </h3>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Site</th>
                <th>Initial Value</th>
                <th>Final Value</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{format(new Date(report.day), "dd/MM/yyyy")}</td>
                  <td>{report.site}</td>
                  <td>R$ {report.initialValue}</td>
                  <td>R$ {report.finalValue}</td>
                  <td>R$ {calculateDifference(
                      report.initialValue,
                      report.finalValue
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPlayersPage;