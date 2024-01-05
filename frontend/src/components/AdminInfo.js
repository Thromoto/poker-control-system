import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminInfo = () => {
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    fetchAdmin(); // Utilize uma função separada para buscar os jogadores
  }, []);

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get("http://localhost:3001/api/admin/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmin(response.data);
    } catch (error) {
      console.error("Error fetching player data", error);
    }
  };

  return (
    <div className="body-admin-players">
      <h1 className="body-admin-players-info">Página em construção</h1>
      <h2>Admin Data (Admin)</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>CPF</th>
            <th>Endereço</th>
            <th>Nascimento</th>
          </tr>
        </thead>
        <tbody>
          {admin.map((admins) => (
            <tr key={admins._id}>
              <td>
                {admins.name} {admins.lastName}
              </td>
              <td>{admins.email}</td>
              <td>{admins.phone}</td>
              <td>{admins.cpf}</td>
              <td>{admins.street}</td>
              <td>{admins.birthday}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInfo;