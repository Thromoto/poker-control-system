import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

import "../../styles/Home.css";

const Home = () => {
  const [name, setName] = useState("");
  const [reports, setReports] = useState([]);
  const [pendingWithdraws, setPendingWithdraws] = useState(null);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [reloadRequests, setReloadRequests] = useState([]);
  const [user, setUser] = useState({});

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Token do localStorage:", token);

      const response = await axios.get("http://localhost:3001/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.name) {
        setName(response.data.name);

        const reportsResponse = await axios.get(
          "http://localhost:3001/api/report",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedReports = reportsResponse.data.map((report) => ({
          ...report,
          day: format(new Date(report.day), "dd/MM/yyyy"),
        }));

        setReports(formattedReports);
      } else {
        console.error("Name not found in response data");
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const calculateDifference = (initialValue, finalValue) => {
    const initial = parseFloat(initialValue);
    const final = parseFloat(finalValue);

    if (!isNaN(initial) && !isNaN(final)) {
      return final - initial;
    }

    return "N/A";
  };

  const renderTablesBySite = () => {
    const uniqueSites = Array.from(
      new Set(reports.map((report) => report.site))
    );

    return uniqueSites.map((site) => {
      const siteReports = reports.filter((report) => report.site === site);

      const totalResult = siteReports.reduce(
        (acc, report) =>
          acc +
          parseFloat(
            calculateDifference(report.initialValue, report.finalValue)
          ),
        0
      );

      return (
        <div key={site} className="div-home">
          <h3 className="home-h3">{`Reports for Site ${site}`}</h3>
          <h4>Total: $ {totalResult.toFixed(2)}</h4>
          <div className="table-home">
            <table>
              <thead>
                <tr>
                  <th>Initial Value</th>
                  <th>Final Value</th>
                  <th>Resultado</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                {siteReports.map((report) => (
                  <tr key={report._id}>
                    <td>$ {report.initialValue}</td>
                    <td>$ {report.finalValue}</td>
                    <td>
                      ${" "}
                      {calculateDifference(
                        report.initialValue,
                        report.finalValue
                      ).toFixed(2)}
                    </td>
                    <td>{report.day}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    });
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedUser = response.data;
      setUser(updatedUser);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };
  
  const caixaSites = () => {
    if (!user || typeof user !== 'object' || !user.sites) {
      return null;
    }
  
    const tableHeader = (
      <thead>
        <tr>
          {Object.keys(user.sites).map((site) => (
            <th key={site}>{site}</th>
          ))}
        </tr>
      </thead>
    );
  
    const tableBody = (
      <tbody>
        <tr>
          {Object.entries(user.sites).map(([siteName, siteValue]) => (
            <td key={siteName}>
              $ {siteValue.lastFinalValue !== undefined
                ? siteValue.lastFinalValue
                : "N/A"}
            </td>
          ))}
        </tr>
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

  const renderReloadtable = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/reload-requests",
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

  const totalReload = () => {
    // Filtra os pedidos de saque com status "APPROVED"
    const approvedReloads = reloadRequests.filter(
      (reload) => reload.status === "APPROVED"
    );

    // Calcula a soma dos valores aprovados
    const total = approvedReloads.reduce(
      (acc, reload) => acc + parseFloat(reload.value),
      0
    );

    return total;
  };

  const renderWithdrawtable = async () => {
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

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm:ss", {
      timeZone: "America/Sao_Paulo",
    });
  };

  const fetchPendingWithdraws = async () => {
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

      const pendingWithdraws = response.data.filter(
        (withdraw) => withdraw.status === "PENDING"
      );

      if (pendingWithdraws.length > 0) {
        setPendingWithdraws(
          <div className="div-home">
            <h3 className="home-h3">Withdraw Requests</h3>
            <div className="table-home">
              <table>
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Day</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWithdraws.map((withdraw) => (
                    <tr key={withdraw._id}>
                      <td>{withdraw.site}</td>
                      <td>$ {withdraw.value}</td>
                      <td>{withdraw.status}</td>
                      <td>{formatDate(withdraw.day)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else {
        setPendingWithdraws(null);
      }
    } catch (error) {
      console.error("Error fetching pending withdraws", error);
      setPendingWithdraws(null);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPendingWithdraws();
    renderWithdrawtable();
    renderReloadtable();
    fetchUser();
  }, []);

  return (
    <div className="body-home">
      <div className="container-home">
        <h2 className="h2-home">Olá, {name}! Aqui estão seus relatórios!</h2>
        {pendingWithdraws}
        <br />
        <br />
        {user && caixaSites()}
        <br />
        <div>
          <h3 className="home-h3">Withdraw/Reload</h3>
          <table>
            <thead>
              <tr>
                <th>Withdraw Total</th>
                <th>Reload Total</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$ {totalWithdraw()}</td>
                <td>$ {totalReload()}</td>
                <td>$ {totalWithdraw() - totalReload()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <div className="table-container">{renderTablesBySite()}</div>
      </div>
    </div>
  );
};

export default Home;
