import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../redux/searchSlice";

// Importamos el archivo CSS
import "./Navbar.css";

// Importamos el contexto
import { AuthContext } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";

// Importamos los componentes necesarios
import LoginModal from "../Modals/LoginModal";
import SignUpModal from "../Modals/SignUpModal";
import UserButtons from "./UserButtons";

// Importamos los íconos (imágenes png)
import logo from "../../images/Logo.png";
import registerIcon from "../../images/register.png";
import loginIcon from "../../images/login.png";
import searchIcon from "../../images/search.png";
import comicsIcon from "../../images/book.png";

const Navbar = ({ 
  alternativeIcon, 
  alternativeTitle,
  isEditUserView = false,
  isEditComicView = false
}) => {

  // Datos y funciones obtenidos de los contextos
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { userData, updateUserData } = useUser();

  const navigate = useNavigate(); // Hook para manejar la navegación

  // Estados para los modales de Login y Registro
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Estados para el scroll del navbar
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  // Manejadores para la barra de búsqueda
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Función para cerrar la sesión
  const handleLogout = () => {
    const keysToRemove = [
      'access_token',
      process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME,
      'userData'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    updateUserData(null);
    navigate("/");
    logout();
  };

  // Función para manejar el scroll del navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible =
        prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    
    <>
      {!isAuthenticated ? (
        <nav className={`navbar-container ${visible ? "" : "navbar-hidden"}`}>
          {/* Primer navbar (principal) */}
          <div className="navbar-no-auth">
            {/* Logo de la página */}
            <div className="navbar-logo">
              <a href="/">
                <img src={logo} alt="..." className="logo" />
              </a>
            </div>

            {/* Barra de búsqueda */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Busca tu cómic preferido...."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />

              <button className="search-button">
                <img src={searchIcon} alt="..." />
              </button>
            </div>

            {/* Botones de Iniciar sesión y Registro */}
            <div className="navbar-buttons">
              <button className="btn" onClick={() => setShowSignUp(true)}>
                Registrarse
                <span>
                  <img src={registerIcon} className="button-img" alt="..." />
                </span>
              </button>

              <button className="btn" onClick={() => setShowLogin(true)}>
                Iniciar sesión
                <span>
                  <img src={loginIcon} className="button-img" alt="..." />
                </span>
              </button>
            </div>
          </div>
        </nav>
      ) : (
        <nav className={`navbar-container navbar-auth ${visible ? "" : "navbar-hidden"}`}>
          {/* Segundo navbar para los cómics */}
          <>
            <span className="comics-span">
              <img src={alternativeIcon ? alternativeIcon : comicsIcon} className="comics-icon" alt="..." />
              {alternativeTitle ? alternativeTitle : "Cómics Recién Agregados"}
            </span>
          </>
          
          {(isEditUserView || isEditComicView) ? (
            <div className="hidden-container"></div>
          ) : (
            <div className="search-container">
              {/* Barra de búsqueda */}
              <input
                type="text"
                placeholder="Busca tu cómic preferido...."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />

              <button className="search-button">
                <img src={searchIcon} alt="..." />
              </button>
            </div>
          )}

          {/* Botón del usuario loggueado */}
          <UserButtons
            userData={userData}
            handleLogout={handleLogout}
            isEditUserView={isEditUserView}
            isEditComicView={isEditComicView}
          />
        </nav>
      )}
      
      {/* Modales de Iniciar sesión y Registro */}
      <SignUpModal
        show={showSignUp}
        handleClose={() => setShowSignUp(false)}
        setShowLogin={setShowLogin}
      />
      
      <LoginModal
        show={showLogin}
        handleClose={() => setShowLogin(false)}
        setShowSignUp={setShowSignUp}
      />
    </>
  );
};

export default Navbar;