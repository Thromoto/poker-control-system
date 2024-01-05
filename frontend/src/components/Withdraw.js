import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns-tz";

import './Withdraw.css';

const Withdraw = () => {
  const [withdrawRequests, setWithdrawRequests] = useState([]);

  useEffect(() => {
    const fetchWithdrawRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/api/withdraw-requests",
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

    fetchWithdrawRequests();
  }, []);

  const handleUpdatePlayerStatus = async (withdrawId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3001/api/withdraw/update-status/${withdrawId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Atualizar localmente o status do jogador para "SACADO"
        setWithdrawRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === withdrawId ? { ...request, playerStatus: "SACADO" } : request
          )
        );
      }
    } catch (error) {
      console.error("Error updating player status", error);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm:ss", {
      timeZone: "America/Sao_Paulo",
    });
  };

  const totalWithdraw = () => {
    // Filtra os pedidos de saque com status "APPROVED"
    const approvedWithdraw = withdrawRequests.filter(
      (reload) => reload.status === "APPROVED"
    );

    // Calcula a soma dos valores aprovados
    const total = approvedWithdraw.reduce(
      (acc, reload) => acc + parseFloat(reload.value),
      0
    );

    return total;
  };

  return (
    <div className="body-withdraw">
      <h2>Player Withdraw Requests</h2>
      <p>Total: R${totalWithdraw()}</p>
      <table>
        <thead>
          <tr>
            <th>Site</th>
            <th>Value</th>
            <th>Day</th>
            <th>Status</th>
            <th>Status (Admin)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.site}</td>
              <td>{request.value}</td>
              <td>{formatDate(request.day)}</td>
              <td>{request.playerStatus}</td>
              <td>{request.status}</td>
              <td>
                {request.playerStatus === "NÃO SAQUEI" && (
                  <button onClick={() => handleUpdatePlayerStatus(request._id)}>
                    Confirm Withdraw
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Withdraw;