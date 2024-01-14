import React, { useState, useEffect } from "react";
import axios from "axios";

import { format } from "date-fns-tz";

import "./AdminCaixa.css";
import AdminTax from "./AdminTax";

const AdminCaixa = () => {
  const [bank, setBank] = useState([]);
  const [value, setValue] = useState("");
  const [day, setDay] = useState(new Date());
  const [selectedBank, setSelectedBank] = useState("");
  const [bankOptions, setBankOptions] = useState([
    "Escolha seu banco",
    "Luxon Pay",
    "MuchBetter",
    "MetaMask",
  ]);

  const fetchBank = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/bank", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBank(response.data);
    } catch (error) {
      console.error("Error fetching bank", error);
    }
  };

  const handleSaveBank = async () => {
    try {
      const token = localStorage.getItem("token");

      // Verificar se o banco já possui um valor
      const existingBank = bank.find(
        (bankItem) => bankItem.bankName === selectedBank
      );

      if (existingBank) {
        // Se o banco já existe, atualizar o valor
        await axios.put(
          `http://localhost:3001/api/bank/${existingBank._id}`,
          {
            value,
            day: day.toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Se o banco não existe, criar um novo
        await axios.post(
          "http://localhost:3001/api/bank",
          {
            value,
            bankName: selectedBank,
            day: day.toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setValue("");
      setSelectedBank("");
      setDay(new Date());
      setBankOptions([
        "Escolha seu banco",
        "Luxon Pay",
        "MuchBetter",
        "MetaMask",
      ]);

      fetchBank();
    } catch (error) {
      console.error("Error saving bank", error);
    }
  };

  useEffect(() => {
    fetchBank();
  }, [selectedBank]);

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", {
      timeZone: "America/Sao_Paulo",
    });
  };

  return (
    <div className="body-admin-caixa">
      <h1>Bank</h1>
      <div className="container-all">
        <div className="container-bank">
          <div className="add-report-form">
            <label>
              Bank:
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                {bankOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Day:
              <input
                type="date"
                value={day.toISOString().split("T")[0]}
                onChange={(date) => setDay(new Date(date.target.value))}
                disabled={!selectedBank || selectedBank === "Escolha seu site"}
                className="date-picker"
              />
            </label>
            <div className="input-row">
              <label>
                Value:
                <input
                  className="input-control"
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={
                    !selectedBank || selectedBank === "Escolha seu site"
                  }
                />
              </label>
            </div>
            <button
              className="button-control"
              onClick={handleSaveBank}
              disabled={!value}
            >
              Save
            </button>
          </div>
          <div className="report-table">
            <table className="table-control">
              <thead>
                <tr>
                  <th>Banco</th>
                  <th>Saldo</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                {bank.map((bankItem) => (
                  <tr key={bankItem._id}>
                    <td>{bankItem.bankName}</td>
                    <td>$ {bankItem.value}</td>
                    <td>{formatDate(bankItem.day)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="container-tax">
          <AdminTax />
        </div>
      </div>
    </div>
  );
};

export default AdminCaixa;
