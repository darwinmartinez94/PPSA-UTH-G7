import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUserRole(decoded.rol);  // Extrae el rol del token
    setUserName(decoded.nombre); //Extrae el nombre 
    console.log("User Role:", decoded.rol); // Debugging
    console.log("User Name:", decoded.nombre); // Debugging
  };

  //funcion para salir y restablecer los valores
  const logout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
