import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importamos el archivo CSS
import "./UserButtons.css";

// Importamos los íconos (imágenes png)
import userIcon from "../../images/session.png";
import plusIcon from "../../images/add.png";

// Importamos el modal de Publicar comic
import PublishComicModal from "../Modals/PublishComicModal";

const UserButtons = ({ handleLogout, onComicPublished }) => {
  const navigate = useNavigate();

  // Estado para controlar si el dropdown del usuario está abierto o cerrado
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Estado para el modal de Publicar comic
  const [showPublish, setShowPublish] = useState(false);

  // Función para manejar el dropdown del usuario
  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Prevenir que el evento se propague
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Funciones para manejar el abrir y cerrar del modal de 'Publicar comic'
  const handleShowPublish = () => setShowPublish(true);
  const handleClosePublish = () => setShowPublish(false);

  // Función para manejar la navegación a la lista de deseos
  const handleWishListClick = () => {
    navigate("/wishlist");
    setIsUserDropdownOpen(false);
  };

  // Función para manejar la navegación a la bandeja de ofertas
  const handleOffersClick = () => {
    navigate("/offers");
    setIsUserDropdownOpen(false);
  };

  return (
    <div className="user-buttons navbar-buttons">
      {/* Botón de Publicar comic */}
      <button className="btn" onClick={handleShowPublish}>
        Publicar comic
        <span>
          <img src={plusIcon} alt="..." className="button-img" />
        </span>
      </button>

      {/* Botón de Usuario */}
      <div className="dropdown-wrapper">
        <img
          src={userIcon}
          alt="..."
          className="icon-user"
          onClick={handleDropdownClick}
        />

        {isUserDropdownOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleWishListClick}>
              Lista de deseos
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={handleOffersClick}>
              Bandeja de ofertas
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Modal de Publicar comic */}
      <PublishComicModal
        show={showPublish}
        handleClose={handleClosePublish}
        onComicPublished={onComicPublished}
      />
    </div>
  );
};

export default UserButtons;
