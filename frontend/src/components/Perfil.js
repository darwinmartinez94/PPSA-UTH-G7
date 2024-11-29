import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import jwtDecode from "jwt-decode";
import './Perfil.css';

function Perfil() {
  const { userName, userRole } = useContext(AuthContext); // Obtener datos del AuthContext
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Obtener el correo desde el token
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setEmail(decodedToken.correo);
    } catch (err) {
      setError("Error al decodificar el token.");
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      showError("No hay token de autenticación.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/usuarios/actualizar_contrasenia",
        { contrasenia: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Contraseña actualizada con éxito");
      setNewPassword(""); 
      setError(""); 
      hideMessage(); 
    } catch (err) {
      console.error("Error al actualizar la contraseña:", err.response?.data || err.message);
      showError(err.response?.data?.error || "Error al actualizar la contraseña.");
    }
  };

  
  const showError = (errorMsg) => {
    setError(errorMsg);
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  
  const hideMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
  <div className="perfil-container ">
    <div className="perfil-card">
      <h2>Perfil</h2>
      <div className="perfil-icon">👤</div> 
      <p>
        <strong>Nombre:</strong> {userName}
      </p>
      <p>
        <strong>Correo:</strong> {email}
      </p>
      <p>
        <strong>Rol:</strong> {userRole}
      </p>

      <h3>Cambiar Contraseña</h3>
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar Contraseña</button>
      </form>

      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  </div>
  );
}

export default Perfil;
