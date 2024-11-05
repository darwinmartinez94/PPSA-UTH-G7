import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUserRole(decoded.rol); 
    setUserName(decoded.nombre); 
    //console.log("User Role:", decoded.rol); 
    //console.log("User Name:", decoded.nombre); 
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
