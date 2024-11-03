import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginRegister from './components/LoginRegister';
import AdminDashboard from './components/AdminDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import UserDashboard from './components/UserDashboard';
import Resumen from './components/Resumen';
import Productos from './components/Productos';
import Categorias from './components/Categorias';
import Proveedores from './components/Proveedores';
import Usuarios from './components/Usuarios';
import Error404 from './components/Error404';

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

          </Route>
        )}



        {userRole === 'Supervisor' && (
          <Route path="/supervisor" element = {<SupervisorDashboard />}>
            <Route path="dashboard" element={<Resumen/>} />

          </Route>
         
        )}
        
        
        {userRole === 'Usuario' && (
        <Route path="/usuario" element={<UserDashboard />} />
        
        
        )}
        
      {/* Ruta de Error 404 */}
       <Route path="*" element={userRole ? 
       <Navigate to={`/${userRole.toLowerCase()}`} /> : <Error404 />} /> 
       </Routes>
    </Router>
  );
}

export default App;

















      
 

