import React from "react";
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css'

function SupervisorDashboard(){
    return(
        <div className="dashboard-container">
           <nav className="sidebar">
            <h2> Inventario Supervisor</h2>
            <ul>
                <li><Link to="/supervisor/dashboard">Resumen</Link></li>
                <li><Link to="/supervisor/productos">Productos</Link></li>
                <li><Link to="/supervisor/categorias">Categorias</Link></li>
                <li><Link to="/supervisor/proveedores">Proveedores</Link></li>
                <li><Link to="/supervisor/perfil">Perfil</Link></li>
                <li><Link to="/supervisor/salir">Salir</Link></li>

            </ul>
            </nav> 

            <div className="main-content">
                <Outlet />

            </div>
        </div>
    )
}
export default SupervisorDashboard;