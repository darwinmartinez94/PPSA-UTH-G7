import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductoMasVendidos.css';

function ProductosMasVendidos() {
    const [productos, setProductos] = useState([]);
    const [productosPorCaducar, setProductosPorCaducar] = useState([]);
    const [error, setError] = useState("");
  
    // Obtener lista de productos
    useEffect(() => {
      const fetchData = async () => {
        try {
          const productosResponse = await axios.get('http://localhost:5000/api/productos');
          const productosData = productosResponse.data;
  
          setProductos(productosData);
  
          // Filtrar productos próximos a caducar (7 días o menos)
          const fechaActual = new Date();
          const productosCercanos = productosData.filter((producto) => {
            if (!producto.caducidad) return false;
            const fechaCaducidad = new Date(producto.caducidad);
            const diferenciaDias = (fechaCaducidad - fechaActual) / (1000 * 60 * 60 * 24);
            return diferenciaDias <= 7 && diferenciaDias > 0;
          });
  
          setProductosPorCaducar(productosCercanos);
        } catch (error) {
          console.error("Hubo un error al obtener los productos:", error);
          setError(error.response?.data?.error || 'Error al cargar los productos');
          setTimeout(() => setError(""), 3000);
        }
      };
      fetchData();
    }, []);
  
    return (
      <div className="container">
        {error && <p className="error">{error}</p>}
  
        <h1>Listado de Productos</h1>
        <table className="report-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock Actual</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto._id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>L {producto.precio_unitario.toFixed(2)}</td>
                <td>{producto.cantidad_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <h2>Productos Próximos a Caducar</h2>
        {productosPorCaducar.length > 0 ? (
          <table className="report-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha de Caducidad</th>
                <th>Días Restantes</th>
              </tr>
            </thead>
            <tbody>
              {productosPorCaducar.map((producto) => {
                const diasRestantes = Math.ceil(
                  (new Date(producto.caducidad) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={producto._id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>{new Date(producto.caducidad).toLocaleDateString()}</td>
                    <td>{diasRestantes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No hay productos próximos a caducar en los próximos 7 días.</p>
        )}
      </div>
    );
  }

export default ProductosMasVendidos;
