import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Resumen.css';

function Resumen() {
  const [productosCount, setProductosCount] = useState(0);
  const [categoriasCount, setCategoriasCount] = useState(0);
  const [proveedoresCount, setProveedoresCount] = useState(0);
  const [usuariosCount, setUsuariosCount] = useState(0);

  useEffect(() => {
    // Obtener conteo de productos
    axios.get('http://localhost:5000/api/productos/count')
      .then(response => setProductosCount(response.data.total_productos))
      .catch(error => console.error("Error al obtener conteo de productos:", error));

    // Obtener conteo de categorías
    axios.get('http://localhost:5000/api/categorias/count')
      .then(response => setCategoriasCount(response.data.total_categorias))
      .catch(error => console.error("Error al obtener conteo de categorías:", error));

    // Obtener conteo de proveedores
    axios.get('http://localhost:5000/api/proveedores/count')
      .then(response => setProveedoresCount(response.data.total_proveedores))
      .catch(error => console.error("Error al obtener conteo de proveedores:", error));

    //Obtener conteo de usuarios
    axios.get('http://localhost:5000/api/usuarios/count')
      .then(response => setUsuariosCount(response.data.total_usuarios))
      .catch(error => console.error("Error al obtener el conteo de usuarios:", error));  
  }, []);

  return (
    <div className="resumen-container">
      <h1>Resumen del Inventario</h1>
      <div className="resumen-cards">
        <div className="card">
          <h3>Productos</h3>
          <p>{productosCount}</p>
        </div>
        <div className="card">
          <h3>Categorías</h3>
          <p>{categoriasCount}</p>
        </div>
        <div className="card">
          <h3>Proveedores</h3>
          <p>{proveedoresCount}</p>
        </div>
        <div className="card">
          <h3>Usuarios</h3>
          <p>{usuariosCount}</p>
        </div>
        <div className="card">
          <h3>Transacciones</h3>
          <p>{usuariosCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Resumen;
