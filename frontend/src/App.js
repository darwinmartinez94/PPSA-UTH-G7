import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginRegister from './components/LoginRegister';
import AdminDashboard from './components/AdminDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import UserioDashboard from './components/UsuarioDashboard';
import Resumen from './components/Resumen';
import Productos from './components/Productos';
import Categorias from './components/Categorias';
import Proveedores from './components/Proveedores';
import Usuarios from './components/Usuarios';
import Error404 from './components/Error404';
import SupervisorProductos from './components/SupervisorProductos'
import SupervisorCategorias from './components/SupervisorCategorias'
import SupervisorProveedor from './components/SupervisorProveedor'
import Usuariocategoria from './components/UsuarioCategoria'
import UsuarioProductos from './components/UsuarioProductos'
import Transacciones from './components/Transacciones';

function App() {
  const { userRole } = useContext(AuthContext);

  // Redirige según el rol del usuario
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<LoginRegister />} />

        {userRole === 'Administrador' && (
          <Route path="/admin" element = {<AdminDashboard/>}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Resumen/>} />
            <Route path="productos" element={<Productos />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="transacciones" element={<Transacciones />}/>

          </Route>
        )}



        {userRole === 'Supervisor' && (
          <Route path="/supervisor" element = {<SupervisorDashboard />}>
            <Route index element={<Navigate to="dashboard"/>} />
            <Route path="dashboard" element={<Resumen/>} />
            <Route path="productos" element={<SupervisorProductos />} />
            <Route path="categorias" element={<SupervisorCategorias />} />
            <Route path="proveedores" element={<SupervisorProveedor />} />

          </Route>
         
        )}
        
        
        {userRole === 'Usuario' && (
        <Route path="/usuario" element={<UserioDashboard />} >
          <Route index element={<Navigate to="dashboard"/>} />
            <Route path="dashboard" element={<Resumen/>} />
            <Route path="productos" element={<UsuarioProductos />} />
            <Route path="categorias" element={<Usuariocategoria />} />
        </Route>
        
        )}
        
      {/* Ruta de Error 404 */}
       <Route path="*" element={userRole ? 
       <Navigate to={`/${userRole.toLowerCase()}`} /> : <Error404 />} /> 
       </Routes>
    </Router>
  );
}

export default App;

















      
 

