import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar o token do localStorage
    localStorage.removeItem('token');

    // Redirecionar para a página de login ou página inicial
    navigate('/'); // ou history.push('/');
  };

  return (
    <button onClick={handleLogout}>Sair</button>
  );
};

export default LogoutButton;