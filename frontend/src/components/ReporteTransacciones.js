import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductoMasVendidos.css';

function ReporteTransacciones(){
    const [transacciones, setTransacciones] = useState([]);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const transaccionesResponse = await axios.get('http://localhost:5000/api/transacciones');
          const transaccionesData = transaccionesResponse.data;
  
          setTransacciones(transaccionesData);
  
        } catch (error) {
          console.error("Hubo un error al obtener las transacciones:", error);
          setError(error.response?.data?.error || 'Error al cargar las transacciones');
          setTimeout(() => 
            setError(""), 3000);
        }
      };
      fetchData();
    }, []);
  
    return (
      <div className="container">
        {error && <p className="error">{error}</p>}
  
        <h1>Listado de Transacciones</h1>
        <table className="report-table">
          <thead>
            <tr>
              <th>Tipo Transacción</th>
              <th>Nombre de Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((transacciones) => (
              <tr key={transacciones._id}>
                <td>{transacciones.tipo_transaccion}</td>
                <td>{transacciones.producto.nombre}</td>
                <td>{transacciones.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

}
export default ReporteTransacciones;