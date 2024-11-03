import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css';

function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>Inventario</h2>
        <ul>
        <li><Link to="/admin/dashboard">Resumen</Link></li>
          <li><Link to="/admin/productos">Productos</Link></li>
          <li><Link to="/admin/categorias">Categorías</Link></li>
          <li><Link to="/admin/proveedores">Proveedores</Link></li>
          <li><Link to="/admin/usuarios">Usuarios</Link></li>
        </ul>
      </nav>

      <div className="main-content">
        {/* Outlet muestra el contenido del componente según la ruta */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;




