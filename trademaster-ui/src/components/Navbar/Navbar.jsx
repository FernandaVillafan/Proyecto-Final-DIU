import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../redux/searchSlice";

// Importamos el archivo CSS
import "./Navbar.css";

// Importamos la autenticación
import { AuthContext } from "../../context/AuthContext";

// Importamos los íconos (imágenes png)
import logo from "../../images/Logo.png";
import registerIcon from "../../images/register.png";
import loginIcon from "../../images/login.png";
import searchIcon from "../../images/search.png";
import comicsIcon from "../../images/book.png";

// Importamos los componentes necesarios
import LoginModal from "../Modals/LoginModal";
import SignUpModal from "../Modals/SignUpModal";
import UserButtons from "./UserButtons";

const Navbar = ({ onComicPublished, alternativeTitle }) => {
  // Search bar handlers
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.search.searchTerm);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseSignin = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem(
      process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME
    );
    navigate("/");
    logout();
  };

  return (
    <>
      {!isAuthenticated ? (
        <nav className={`navbar-container ${visible ? "" : "navbar-hidden"}`}>
          <div className="navbar-no-auth">
            <div className="navbar-logo">
              <a href="/">
                <img src={logo} alt="..." className="logo" />
              </a>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Busca tu comic preferido..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-button">
                <img src={searchIcon} alt="Buscar" />
              </button>
            </div>
            <div className="navbar-buttons">
              <button className="btn" onClick={handleShowSignUp}>
                Registrarse
                <span>
                  <img src={registerIcon} className="button-img" alt="..." />
                </span>
              </button>
              <button className="btn" onClick={handleShowLogin}>
                Iniciar sesión
                <span>
                  <img src={loginIcon} className="button-img" alt="..." />
                </span>
              </button>
            </div>
          </div>
        </nav>
      ) : (
        <nav
          className={`navbar-container navbar-auth ${
            visible ? "" : "navbar-hidden"
          }`}
        >
          <>
            <span className="comics-span">
              <img src={comicsIcon} className="comics-icon" alt="..." />
              {alternativeTitle ? alternativeTitle : "Comics Recién Agregados"}
            </span>
          </>
          <div className="search-container">
            <input
              type="text"
              placeholder="Busca tu comic preferido..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-button">
              <img src={searchIcon} alt="Buscar" />
            </button>
          </div>

          <UserButtons
            handleLogout={handleLogout}
            onComicPublished={onComicPublished}
          />
        </nav>
      )}
      <SignUpModal
        show={showSignUp}
        handleClose={handleCloseSignin}
        setShowLogin={setShowLogin}
      />
      <LoginModal
        show={showLogin}
        handleClose={handleCloseLogin}
        setShowSignUp={setShowSignUp}
      />
    </>
  );
};

export default Navbar;
