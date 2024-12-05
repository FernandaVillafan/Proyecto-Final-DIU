import React, { createContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from '../helpers/Auth';

// Creamos el contexto de autenticación
export const AuthContext = createContext();
// Obtenemos el nombre de la cookie del token desde las variables de entorno
const cookieName = process.env.REACT_APP_TOKEN_COOKIE_NAME;

// Función que provee el contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estado para controlar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función que verifica si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const token = getCookie(`${cookieName}`);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para manejar el inicio de sesión
  const login = (token) => {
    setCookie(cookieName,token, process.env.REACT_APP_TOKEN_EXPIRATION_TIME);
    setIsAuthenticated(true);
  };

  // Función para manejar el cierre de sesión
  const logout = () => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};