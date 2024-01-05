import React, { useState, useEffect } from "react";
import axios from "axios";

import "./AdminHome.css";

const AdminHome = () => {
  const [withdraw, setWithdraw] = useState([]);
  const [reload, setReload] = useState([]);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalReload, setTotalReload] = useState(0);

  useEffect(() => {
    getWithdraw();
    getReload();
  }, []);

  const getWithdraw = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get(
        "http://localhost:3001/api/withdraw-requests/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWithdraw(response.data);
      setTotalWithdraw(calculateApprovedTotal(response.data));
    } catch (error) {
      console.error("Error fetching withdraw data", error);
    }
  };

  const getReload = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get(
        "http://localhost:3001/api/reload-requests/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReload(response.data);
      setTotalReload(calculateApprovedTotal(response.data));
    } catch (error) {
      console.error("Error fetching reload data", error);
    }
  };

  const calculateApprovedTotal = (data) => {
    return data
      .filter((item) => item.status === "APPROVED")
      .reduce((total, item) => total + parseFloat(item.value), 0);
  };

  return (
    <div className="body-admin-home">
      <h1>Home - Construção</h1>
      <h2>Controle de Entrada e Saída</h2>

      <div>
        <h4>Recargas - Total Aprovado: R$ {totalReload.toFixed(2)}</h4>
      </div>
      <div>
        <h4>Saques - Total Aprovado: R$ {totalWithdraw.toFixed(2)}</h4>
      </div>
      <div>
        <h4>Total - Total Aprovado: R$ {totalWithdraw - totalReload}</h4>
      </div>
    </div>
  );
};

export default AdminHome;