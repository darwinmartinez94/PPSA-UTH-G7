import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

function Salir() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    
    const handleLogout = () => {
      // Elimina el token del localStorage
      localStorage.removeItem('token');

      // Limpia el estado del contexto (si es necesario)
      if (logout) {
        logout();
      }

      setTimeout(() => {
        navigate('/login');
      }, );
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div>
      <p>Saliendo del sistema...</p>
    </div>
  );
}

export default Salir;
