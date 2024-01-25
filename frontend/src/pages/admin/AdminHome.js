import React, { useState, useEffect } from "react";
import axios from "axios";

import "../../styles/AdminHome.css";

const AdminHome = () => {
  const [withdraw, setWithdraw] = useState([]);
  const [reload, setReload] = useState([]);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalReload, setTotalReload] = useState(0);
  const [user, setUser] = useState({});

  useEffect(() => {
    getWithdraw();
    getReload();
    fetchUser();
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

  const fetchUser = async () => {
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

      console.log("User response:", response.data);
      const updatedUser = response.data;
      console.log(response.data);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const caixaSites = () => {
    if (!user || !Array.isArray(user) || user.length === 0) {
      console.log("No user data");
      return null;
    }
  
    const tableHeader = (
      <thead>
        <tr>
          <th>Nome</th>
          {Object.keys(user[0].sites).map((site) => (
            <th key={site}>{site}</th>
          ))}
        </tr>
      </thead>
    );
  
    const tableBody = (
      <tbody>
        {user.map((userData) => (
          <tr key={userData._id}>
            <td>{userData.name}</td>
            {Object.entries(userData.sites).map(([siteName, siteValue]) => (
              <td key={siteName}>
                ${" "}
                {siteValue.lastFinalValue !== undefined
                  ? siteValue.lastFinalValue.toFixed(2)
                  : "N/A"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  
    return (
      <div className="div-home">
        <h3 className="home-h3">Final Value for Each Site</h3>
        <div className="table-home">
          <table>
            {tableHeader}
            {tableBody}
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="body-admin-home">
      <h1>Home - Construção</h1>
      <h2>Controle de Entrada e Saída</h2>
      <table>
        <thead>
          <tr>
            <th>Withdraw</th>
            <th>Reload</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>R$ {totalWithdraw.toFixed(2)}</td>
            <td>R$ {totalReload.toFixed(2)}</td>
            <td>R$ {totalWithdraw - totalReload}</td>
          </tr>
        </tbody>
      </table>
      {caixaSites()}
    </div>
  );
};

export default AdminHome;
