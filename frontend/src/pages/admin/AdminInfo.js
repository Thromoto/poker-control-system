import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

import "../../styles/AdminPlayersInfo.css";

const AdminInfo = () => {
  const [admin, setAdmin] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

      const response = await axios.get(
        "http://localhost:3001/api/admin/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdmin(response.data);
    } catch (error) {
      console.error("Error fetching player data", error);
    }
  };

  const handleDelete = (adminId) => {
    const adminToDelete = admin.find((adm) => adm._id === adminId);
    setSelectedAdmin(adminToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !selectedAdmin) {
        console.error("Token or selected admin not found");
        return;
      }

      await axios.delete(
        `http://localhost:3001/api/admin/admin/${selectedAdmin._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsDeleteModalOpen(false);

      // Atualize os jogadores no estado local
      fetchAdmin();
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const handleModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="body-admin-players">
      <h1>Admin Infos</h1>
      <div className="container-players-info">
        <div className="report-table-info-players">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Endereço</th>
                <th>Nascimento</th>
                <th>Actions</th>
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
                  <td>
                    <button
                      className="admin-info-button"
                      onClick={() => handleDelete(admins._id)}
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
      {/* Modal de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Delete Player Modal"
      >
        <h2>Delete Player</h2>
        <p>Are you sure you want to delete {selectedAdmin?.name}?</p>
        <button onClick={handleDeleteConfirm}>Confirm</button>
        <button onClick={handleModalClose}>Cancel</button>
      </Modal>
    </div>
  );
};

export default AdminInfo;
