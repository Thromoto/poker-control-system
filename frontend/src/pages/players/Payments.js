import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns-tz";

import "../../styles/Payments.css";

const Payments = () => {
  const [value, setValue] = useState("");
  const [day, setDay] = useState(new Date());
  const [paymentRequests, setPaymentRequests] = useState([]);

  useEffect(() => {
    // Carregar os pagamentos do jogador ao montar o componente
    fetchPaymentRequests();
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/payment-requests",
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

  const totalPayment = () => {
    // Filtra os pedidos de pagamento com status "APPROVED"
    const approvedPayments = paymentRequests.filter(
      (payment) => payment.status === "APPROVED"
    );

    // Calcula a soma dos valores aprovados
    const total = approvedPayments.reduce(
      (acc, payment) => acc + parseFloat(payment.value),
      0
    );

    return total;
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/api/payment",
        {
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
      setDay(new Date());
      // Após enviar a solicitação, recarregar os pagamentos do jogador
      fetchPaymentRequests();
    } catch (error) {
      console.error("Error paying", error);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm:ss", {
      timeZone: "America/Sao_Paulo",
    });
  };

  return (
    <div className="body-payments">
      <h1>Payments</h1>
      <div className="container-payments">
        <div className="payments-inputs">
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
            <input
              type="date"
              value={day.toISOString().split("T")[0]}
              onChange={(e) => setDay(new Date(e.target.value))}
              disabled={!value}
            />
          </label>
          <button onClick={handlePayment} disabled={!value}>
            Solicitar
          </button>
        </div>
        <div className="payments-remumo">
          <h2>Resumo dos Pagamentos</h2>
          <h4>Total: $ {totalPayment()}</h4>
          <div className="payments-resumo2">
            <table>
              <thead>
                <tr>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentRequests.map((request) => (
                  <tr key={request._id}>
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

export default Payments;
