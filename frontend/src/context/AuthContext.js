import React, { createContext, useState, useEffect } from 'react';
import  jwtDecode  from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  //console.log(userName)
  //console.log(userRole)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.rol);
        setUserName(decoded.nombre);
        
      } catch (error) {
        console.error('Token inválido o expirado.', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUserRole(decoded.rol);
    setUserName(decoded.nombre);
    
  };

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
