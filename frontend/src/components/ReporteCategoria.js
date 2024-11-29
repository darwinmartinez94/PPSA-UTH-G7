import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductoMasVendidos.css';

function ReporteCategoria(){
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const categoriasResponse = await axios.get('http://localhost:5000/api/categorias');
          const categoriasData = categoriasResponse.data;
  
          setCategorias(categoriasData);
  
        } catch (error) {
          console.error("Hubo un error al obtener las categorias:", error);
          setError(error.response?.data?.error || 'Error al cargar las categorias');
          setTimeout(() => 
            setError(""), 3000);
        }
      };
      fetchData();
    }, []);
  
    return (
      <div className="container">
        {error && <p className="error">{error}</p>}
  
        <h1>Listado de categorias</h1>
        <table className="report-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria._id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  
}
export default ReporteCategoria;