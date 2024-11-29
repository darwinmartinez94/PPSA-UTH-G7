import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductoMasVendidos.css';

function ReporteProveedores(){
    const [provvedores, setProveedores] = useState([]);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const proveedoresResponse = await axios.get('http://localhost:5000/api/proveedores');
          const proveedoresData = proveedoresResponse.data;
  
          setProveedores(proveedoresData);
  
        } catch (error) {
          console.error("Hubo un error al obtener los proveedores:", error);
          setError(error.response?.data?.error || 'Error al cargar los proveedores');
          setTimeout(() => 
            setError(""), 3000);
        }
      };
      fetchData();
    }, []);
  
    return (
      <div className="container">
        {error && <p className="error">{error}</p>}
  
        <h1>Listado de Proveedores</h1>
        <table className="report-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Telefono</th>
              <th>Correo</th>

            </tr>
          </thead>
          <tbody>
            {provvedores.map((proveedor) => (
              <tr key={proveedor._id}>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.direccion}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

}
export default ReporteProveedores;