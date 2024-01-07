import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./Control.css";

const Control = () => {
  const [initialValue, setInitialValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [day, setDay] = useState(new Date());
  const [reports, setReports] = useState([]);
  const [siteOptions, setSiteOptions] = useState([
    "Escolha seu site",
    "Chico",
    "Party",
    "ACR",
  ]);
  const [currentTable, setCurrentTable] = useState("");

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  const handleSaveReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const finalValueToSave = finalValue || findLastFinalValue();

      // Converte o initialValue para número, ou usa 0 se for vazio ou NaN
      const initial = initialValue !== "" ? parseFloat(initialValue) : 0;

      await axios.post(
        "http://localhost:3001/api/report",
        {
          initialValue: !isNaN(initial) ? initial : 0,
          finalValue: finalValueToSave,
          site: selectedSite,
          day: day.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInitialValue("");
      setFinalValue("");
      setSelectedSite("");

      fetchReports();
    } catch (error) {
      console.error("Error saving report", error);
    }
  };

  const findLastFinalValue = () => {
    const lastReportForSite = reports
      .filter((report) => report.site === selectedSite)
      .sort((a, b) => new Date(b.day) - new Date(a.day))[0];

    return lastReportForSite !== undefined
      ? lastReportForSite.finalValue
      : null;
  };

  const calculateDifference = (initialValue, finalValue) => {
    const initial = parseFloat(initialValue);
    const final = parseFloat(finalValue);

    if (!isNaN(initial) && !isNaN(final)) {
      return final - initial;
    }

    return "N/A";
  };

  useEffect(() => {
    fetchReports();
  }, [selectedSite]);

  const renderTablesBySite = () => {
    const uniqueSites = Array.from(
      new Set(reports.map((report) => report.site))
    );

    return (
      <div>
        <div className="selectt">
          <label>
            {/* Escolha o site: */}
            <select
              value={currentTable}
              onChange={(e) => setCurrentTable(e.target.value)}
              className="select-control"
            >
              <option value="">Selecione um site</option>
              {uniqueSites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </label>
        </div>
        {currentTable && (
          <div className="table-container">
            <h3 className="h3-control">{`Reports for Site ${currentTable}`}</h3>
            <div className="report-table">
              <table className="table-control">
                <thead>
                  <tr>
                    <th className="report-initial-value">Initial Value</th>
                    <th className="report-final-value">Final Value</th>
                    <th className="report-result">Resultado</th>
                    <th className="report-day">Day</th>
                  </tr>
                </thead>
                <tbody>
                  {reports
                    .filter((report) => report.site === currentTable)
                    .map((report) => (
                      <tr key={report._id} className="report-row">
                        <td className="report-initial-value">
                          $ {report.initialValue}
                        </td>
                        <td className="report-final-value">
                          $ {report.finalValue}
                        </td>
                        <td className="report-result">
                          $ {calculateDifference(
                            report.initialValue,
                            report.finalValue
                          )}
                        </td>
                        <td className="report-day">
                          {new Date(report.day).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="body-control">
      <h1 className="h2-control">Control Page</h1>
      <div className="container-control">
        <div className="container-control1">
          <h3 className="h3-control">New Report</h3>
          <div className="add-report-form">
            <label>
              Site:
              <select
                value={selectedSite}
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
              Day:
              <DatePicker
                selected={day}
                onChange={(date) => setDay(date)}
                dateFormat="dd/MM/yyyy"
                disabled={!selectedSite || selectedSite === "Escolha seu site"}
                className="date-picker"
              />
            </label>
            <div className="input-row">
              <label>
                Initial Value:
                <input
                  className="input-control"
                  type="text"
                  value={initialValue}
                  onChange={(e) => setInitialValue(parseFloat(e.target.value))}
                  disabled={
                    !selectedSite ||
                    selectedSite === "Escolha seu site" ||
                    findLastFinalValue() !== null
                  }
                />
              </label>
              <label>
                Final Value:
                <input
                  className="input-control"
                  type="text"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  disabled={
                    !selectedSite || selectedSite === "Escolha seu site"
                  }
                />
              </label>
            </div>
            <button className="button-control" onClick={handleSaveReport}>
              Save Report
            </button>
          </div>
        </div>
        <div className="container-contro2">
          <div className="tables-container">
            <h3 className="h3-control">Reports</h3>
            {renderTablesBySite()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Control;
