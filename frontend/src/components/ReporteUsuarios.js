import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductoMasVendidos.css';

function ReporteUsuarios(){
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const usuariosResponse = await axios.get('http://localhost:5000/api/usuarios');
          const usuariosData = usuariosResponse.data;
  
          setUsuarios(usuariosData);
  
        } catch (error) {
          console.error("Hubo un error al obtener los usuarios:", error);
          setError(error.response?.data?.error || 'Error al cargar los usuarios');
          setTimeout(() => 
            setError(""), 3000);
        }
      };
      fetchData();
    }, []);
  
    return (
      <div className="container">
        {error && <p className="error">{error}</p>}
  
        <h1>Listado de Usuarios</h1>
        <table className="report-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>

            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuarios) => (
              <tr key={usuarios._id}>
                <td>{usuarios.nombre}</td>
                <td>{usuarios.correo}</td>
                <td>{usuarios.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}
export default ReporteUsuarios;