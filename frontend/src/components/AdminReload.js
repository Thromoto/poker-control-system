import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns-tz";

import "./AdminReload.css";

const AdminReload = () => {
  const [reloadRequests, setReloadRequests] = useState([]);

  useEffect(() => {
    // Carregar solicitações de recarga quando o componente for montado
    const fetchReloadRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/api/admin/reload-requests",
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

    fetchReloadRequests();
  }, []);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      // Obter o token de autorização do localStorage
      const token = localStorage.getItem("token");

      // Configurar o cabeçalho de autorização
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Enviar a solicitação com o cabeçalho de autorização
      await axios.put(
        `http://localhost:3001/api/admin/reload-requests/${requestId}`,
        { status: newStatus },
        config
      );

      // Atualizar localmente o status da solicitação de recarga
      setReloadRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating reload request status", error);
    }
  };

  const handleDeleteReload = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3001/api/admin/reload-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remover localmente a solicitação de saque deletada
      setReloadRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Error deleting reload request", error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const formattedDate = format(
      new Date(dateTimeString),
      "dd/MM/yyyy HH:mm", // Use XXX para incluir o offset de fuso horário
      { timeZone: "America/Sao_Paulo" } // Defina o fuso horário desejado
    );
    return formattedDate;
  };

  return (
    <div className="body-admin-reload">
      <h1>Reload Requests</h1>
      <div className="container-admin-reload">
        <div className="report-table-reload">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Site</th>
                <th>Value</th>
                <th>Day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reloadRequests.map((request) => (
                <tr key={request._id}>
                  {request.createdBy && request.createdBy.name ? (
                    <td>{request.createdBy.name}</td>
                  ) : (
                    <td>User Name Not Available</td>
                  )}
                  <td>{request.site}</td>
                  <td>$ {request.value}</td>
                  <td>{formatDateTime(request.day)}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.status === "PENDING" && (
                      <>
                        <button
                          className="button-admin-reload"
                          onClick={() =>
                            handleUpdateStatus(request._id, "APPROVED")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="button-admin-reload"
                          onClick={() =>
                            handleUpdateStatus(request._id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="button-admin-reload"
                      onClick={() => handleDeleteReload(request._id)}
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

export default AdminReload;
