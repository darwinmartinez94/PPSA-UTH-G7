import React, { useState } from "react";
import './Reportes.css'
import ProductosMasVendidos from "./ProductosMasVendidos"; 
import ReporteCategoria from "./ReporteCategoria";
import ReporteProveedores from "./ReporteProveedores";
import ReporteUsuarios from "./ReporteUsuarios";
import ReporteTransacciones from "./ReporteTransacciones";

function Reportes() {
    const [activeReport, setActiveReport] = useState("productos");

    const renderReport = () => {
        switch (activeReport) {
            case "productos":
                return <ProductosMasVendidos />;
            case "categorias":
                return <ReporteCategoria />; 
            case "proveedores":
                return <ReporteProveedores />;   
            case "usuarios":
                return < ReporteUsuarios />;   
            case "transacciones":
                return <ReporteTransacciones />;

            default:
                return <h2>Seleccione un reporte</h2>;
        }
    };

    return (
        <div>
            <h1>Módulo de Reportes</h1>
            <div className="menu">
                <button onClick={() => setActiveReport("productos")}>Reporte Productos</button>
                <button onClick={() => setActiveReport("categorias")}>Reporte Categorias</button>
                <button onClick={() => setActiveReport("proveedores")}>Reporte Proveedores</button>
                <button onClick={() => setActiveReport("usuarios")}>Reporte Usuarios</button>
                <button onClick={() => setActiveReport("transacciones")}>Reporte Transacciones</button>
            </div>
            <div className="report-content">
                {renderReport()}
            </div>
        </div>
    );
}

export default Reportes;
