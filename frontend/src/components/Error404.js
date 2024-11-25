import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Error404.css';
import errorImage from './Error_404.jpeg';  

function Error404() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/login');  // Navega de vuelta a la ruta del login
  };

  return (
    <div className="error-page">
      <div className="error-container">
       
        <h1>Error 404!</h1>
        <h2>PPSA-UTH-G7</h2>
        <p>Página no encontrada</p>
        <img
          src={errorImage} 
          alt="Página no encontrada"
        />
        <button onClick={handleGoBack}>Regresar al Login</button>
      </div>
      <footer>
        <p>Derechos reservados 2024</p>
      </footer>
    </div>
  );
}

export default Error404;
