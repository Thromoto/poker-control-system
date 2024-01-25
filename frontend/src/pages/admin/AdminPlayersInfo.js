import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

import "../../styles/AdminPlayersInfo.css";

const AdminPlayersInfo = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchPlayers(); // Utilize uma função separada para buscar os jogadores
  }, []);

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get(
        "http://localhost:3001/api/admin/players",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching player data", error);
    }
  };

  const handleEdit = (playerId) => {
    const playerToEdit = players.find((player) => player._id === playerId);
    setSelectedPlayer(playerToEdit);
    setIsEditModalOpen(true);
  };

  const handleDelete = (playerId) => {
    const playerToDelete = players.find((player) => player._id === playerId);
    setSelectedPlayer(playerToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !selectedPlayer) {
        console.error("Token or selected player not found");
        return;
      }

      const editedFields = {
        name: selectedPlayer.name,
        lastName: selectedPlayer.lastName,
        email: selectedPlayer.email,
        street: selectedPlayer.street,
        cpf: selectedPlayer.cpf,
        birthday: selectedPlayer.birthday,
        phone: selectedPlayer.phone,
      };

      await axios.put(
        `http://localhost:3001/api/admin/players/${selectedPlayer._id}`,
        editedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditModalOpen(false);

      // Atualize os jogadores no estado local
      fetchPlayers();
    } catch (error) {
      console.error("Error editing player:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !selectedPlayer) {
        console.error("Token or selected player not found");
        return;
      }

      await axios.delete(
        `http://localhost:3001/api/admin/players/${selectedPlayer._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsDeleteModalOpen(false);

      // Atualize os jogadores no estado local
      fetchPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="body-admin-players">
      <h1>Players Infos</h1>
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
              {players.map((player) => (
                <tr key={player._id}>
                  <td>
                    {player.name} {player.lastName}
                  </td>
                  <td>{player.email}</td>
                  <td>{player.phone}</td>
                  <td>{player.cpf}</td>
                  <td>{player.street}</td>
                  <td>{player.birthday}</td>
                  <td>
                    <button
                      className="admin-info-button"
                      onClick={() => handleEdit(player._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-info-button"
                      onClick={() => handleDelete(player._id)}
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
      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Edit Player Modal"
      >
        <h2>Edit Player</h2>
        <label>
          Name:
          <input
            type="text"
            value={selectedPlayer?.name}
            onChange={(e) =>
              setSelectedPlayer({
                ...selectedPlayer,
                name: e.target.value,
              })
            }
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={selectedPlayer?.lastName}
            onChange={(e) =>
              setSelectedPlayer({
                ...selectedPlayer,
                lastName: e.target.value,
              })
            }
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            value={selectedPlayer?.email}
            onChange={(e) =>
              setSelectedPlayer({
                ...selectedPlayer,
                email: e.target.value,
              })
            }
          />
        </label>
        <label>
          Telefone:
          <input
            type="text"
            value={selectedPlayer?.phone}
            onChange={(e) =>
              setSelectedPlayer({
                ...selectedPlayer,
                phone: e.target.value,
              })
            }
          />
        </label>
        <label>
          CPF:
          <input
            type="text"
            value={selectedPlayer?.cpf}
            onChange={(e) =>
              setSelectedPlayer({
                ...selectedPlayer,
                cpf: e.target.value,
              })
            }
          />
        </label>
        <label>
          Endereço:
          <input
            type="text"
            value={selectedPlayer?.street}
            onChange={(e) =>
              setSelectedPlayer({
                ...selectedPlayer,
                street: e.target.value,
              })
            }
          />
        </label>
        <label>
          Nascimento:
          <input
            type="text"
            value={selectedPlayer?.birthday}
            onChange={(e) =>
              setSelectedPlayer({
                ...selectedPlayer,
                birthday: e.target.value,
              })
            }
          />
        </label>
        <button className="admin-info-button-modal" onClick={handleEditSubmit}>
          Save Changes
        </button>
        <button className="admin-info-button-modal" onClick={handleModalClose}>
          Cancel
        </button>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Delete Player Modal"
      >
        <h2>Delete Player</h2>
        <p>Are you sure you want to delete {selectedPlayer?.name}?</p>
        <button onClick={handleDeleteConfirm}>Confirm</button>
        <button onClick={handleModalClose}>Cancel</button>
      </Modal>
    </div>
  );
};

export default AdminPlayersInfo;
