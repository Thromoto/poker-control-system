import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns-tz";

import "./AdminPayments.css";

const AdminPayments = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);

  useEffect(() => {
    // Carregar solicitações de pagamento quando o componente for montado
    const fetchPaymentRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/api/admin/payment-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPaymentRequests(response.data);
      } catch (error) {
        console.error("Error fetching payment requests", error);
      }
    };

    fetchPaymentRequests();
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
        `http://localhost:3001/api/admin/payment-requests/${requestId}`,
        { status: newStatus },
        config
      );

      // Atualizar localmente o status da solicitação de pagamento
      setPaymentRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating payment request status", error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const formattedDate = format(
      new Date(dateTimeString),
      "dd/MM/yyyy HH:mm:ss", // Use XXX para incluir o offset de fuso horário
      { timeZone: "America/Sao_Paulo" } // Defina o fuso horário desejado
    );
    return formattedDate;
  };

  return (
    <div className="body-admin-payments">
      <h1>Payment Requests</h1>
      <div className="container-admin-payments">
        <div className="report-table-payments">
          <table className="table-control">
            <thead>
              <tr>
                <th>Player</th>
                <th>Value</th>
                <th>Day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentRequests.map((request) => (
                <tr key={request._id}>
                  {request.createdBy && request.createdBy.name ? (
                    <td>{request.createdBy.name}</td>
                  ) : (
                    <td>User Name Not Available</td>
                  )}
                  <td>$ {request.value}</td>
                  <td>{formatDateTime(request.day)}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.status === "PENDING" && (
                      <>
                        <button
                          className="button-admin-payments"
                          onClick={() =>
                            handleUpdateStatus(request._id, "APPROVED")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="button-admin-payments1"
                          onClick={() =>
                            handleUpdateStatus(request._id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
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

export default AdminPayments;
