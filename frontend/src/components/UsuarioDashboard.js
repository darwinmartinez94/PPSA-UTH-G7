import React from "react";
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css'

function UsuarioDashboard (){
   
    return(
        <div className="dashboard-container">
           <nav className="sidebar">
            <h2> Inventario Usuario</h2>
            <ul>
                <li><Link to="/usuario/dashboard">Resumen</Link></li>
                <li><Link to="/usuario/productos">Productos</Link></li>
                <li><Link to="/usuario/categorias">Categorias</Link></li>
                <li><Link to="/usuario/perfil">Perfil</Link></li>
                <li><Link to="/usuario/salir">Salir</Link></li>
            </ul>
            </nav> 

            <div className="main-content">
                <Outlet />

            </div>
        </div>
    )
}
export default UsuarioDashboard;