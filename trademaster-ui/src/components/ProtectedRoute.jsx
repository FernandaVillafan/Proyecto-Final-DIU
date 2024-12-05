import React from "react";
import { Navigate } from "react-router-dom";

// Función que protege las rutas verificando la autenticación.
// Si el usuario no está autenticado o su sesión expiró,
// será redirigido a la página principal.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  // Si no hay token, redirigimos al login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token válido, permitimos el acceso a la página
  return children;
};

export default ProtectedRoute;