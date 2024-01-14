import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns-tz";

import "./AdminWithdraw.css";

const AdminWithdraw = () => {
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [value, setValue] = useState("");
  const [day, setDay] = useState(new Date());
  const [players, setPlayers] = useState([]);
  const [siteOptions, setSiteOptions] = useState([
    "Escolha seu site",
    "Chico",
    "Party",
    "ACR",
  ]);

  const fetchWithdrawRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/admin/withdraw-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWithdrawRequests(response.data);
    } catch (error) {
      console.error("Error fetching withdraw requests", error);
    }
  };

  const fetchPlayers = async () => {
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
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players", error);
    }
  };

  const handleCreateWithdrawRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/api/withdraw",
        {
          playerId: selectedPlayer,
          site: selectedSite,
          value: parseFloat(value),
          day: day.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Limpar os campos após a criação da solicitação
      setSelectedPlayer("");
      setSelectedSite("");
      setValue("");
      setDay(new Date());
      // Recarregar a lista de solicitações após a criação
      fetchWithdrawRequests();
    } catch (error) {
      console.error("Error creating withdraw request", error);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/admin/withdraw-requests/${requestId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Atualizar localmente o status da solicitação de saque
      setWithdrawRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating withdraw request status", error);
    }
  };

  const handlePlayerUpdateStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/withdraw/update-status/${requestId}`,
        { playerStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Atualizar localmente o status do jogador na solicitação de saque
      setWithdrawRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, playerStatus: newStatus }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating player status", error);
    }
  };

  const handleDeleteWithdraw = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3001/api/admin/withdraw-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remover localmente a solicitação de saque deletada
      setWithdrawRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Error deleting withdraw request", error);
    }
  };

  useEffect(() => {
    fetchWithdrawRequests();
    fetchPlayers();
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", {
      timeZone: "America/Sao_Paulo",
    });
  };

  return (
    <div className="body-admin-withdraw">
      <h1>Withdraw Requests</h1>
      <div className="container-admin-withdraw">
        <div className="admin-withdraw-boxes">
          <div className="add-report-form">
            <label>
              Player:
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
              >
                <option value="" disabled>
                  Selecione o jogador
                </option>
                {players.map((player) => (
                  <option key={player._id} value={player._id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Site:
              <select
                value={selectedSite}
                disabled={
                  !selectedPlayer || selectedPlayer === "Selecione o jogador"
                }
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
                disabled={!selectedSite || selectedSite === "Escolha seu site"}
                onChange={(e) => setValue(e.target.value)}
              />
            </label>
            <label>
              Data:
              <input
                type="date"
                value={day.toISOString().split("T")[0]}
                disabled={!selectedSite || selectedSite === "Escolha seu site"}
                onChange={(e) => setDay(new Date(e.target.value))}
              />
            </label>
            <button
              className="button-control"
              onClick={handleCreateWithdrawRequest}
              disabled={!selectedSite || selectedSite === "Escolha seu site"}
            >
              Criar Solicitação
            </button>
          </div>
        </div>
        <div className="admin-withdraw-table">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Site</th>
                <th>Value</th>
                <th>Day</th>
                <th>Status (Player)</th>
                <th>Status (Admin)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.playerId.name}</td>
                  <td>{request.site}</td>
                  <td>$ {request.value}</td>
                  <td>{formatDate(request.day)}</td>
                  <td>{request.playerStatus}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.playerStatus === "NAO_SACADO" && (
                      <>
                        <button
                          className="button-withdraw-edit"
                          onClick={() =>
                            handlePlayerUpdateStatus(request._id, "SACADO")
                          }
                        >
                          Player Sacado
                        </button>
                      </>
                    )}
                    {request.status === "PENDING" && (
                      <>
                        <button
                          className="button-withdraw-edit"
                          onClick={() =>
                            handleUpdateStatus(request._id, "APPROVED")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="button-withdraw-edit"
                          onClick={() =>
                            handleUpdateStatus(request._id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="button-withdraw-edit"
                      onClick={() => handleDeleteWithdraw(request._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdraw;
