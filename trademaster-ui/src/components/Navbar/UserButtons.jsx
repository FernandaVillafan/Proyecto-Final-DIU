import React, { useState } from "react";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

// Importamos el archivo CSS
import "./UserButtons.css";

// Importamos el contexto
import { useUser } from '../../context/UserContext';

// Importamos el modal de Publicar cómic
import PublishComicModal from "../Modals/PublishComicModal";

// Importamos los íconos (imágenes png)
import defaultImage from "../../images/default-user.jpg";
import plusIcon from "../../images/add.png";

const UserButtons = ({ handleLogout }) => {

  const navigate = useNavigate(); // Hook para manejar la navegación
  
  // Obtenemos los datos del contexto
  const { userData } = useUser();

  // Estado para controlar si el dropdown del usuario está abierto o cerrado
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Estado para el modal de Publicar cómic
  const [showPublish, setShowPublish] = useState(false);

  // Función para manejar el dropdown del usuario
  const handleDropdownClick = (e) => {
    setShowUserDropdown(!showUserDropdown);
  };

  // Función para manejar la navegación a la configuración del usuario
  const handleConfigClick = () => {
    navigate("/update-user");
    setShowUserDropdown(false);
  }

  // Función para manejar la navegación a los cómics publicados por el usuario
  const handleMyComicsClick = () => {
    navigate("/my-comics");
    setShowUserDropdown(false);
  }

  // Función para manejar la navegación a la lista de deseos
  const handleWishListClick = () => {
    navigate("/wishlist");
    setShowUserDropdown(false);
  };

  // Función para manejar la navegación a la bandeja de ofertas
  const handleOffersClick = () => {
    navigate("/offers");
    setShowUserDropdown(false);
  };

  return (

    <div className="user-buttons navbar-buttons">
      {/* Botón de Publicar cómic */}
      <button className="btn" onClick={() => {
        setShowPublish(true);
        setShowUserDropdown(false);
      }}>
        Publicar cómic
        <span>
          <img src={plusIcon} alt="..." className="button-img" />
        </span>
      </button>

      {/* Botón del Usuario */}
      <Dropdown id="dropdown-user" show={showUserDropdown} align="end">
        <Dropdown.Toggle as="div" className="icon-btn" onClick={handleDropdownClick}>
          <img 
            src={userData?.image ? `${process.env.REACT_APP_API_URL}/${userData.image}` : defaultImage}
            alt="..." 
            className={userData?.image ? "icon-img" : "icon-user"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </Dropdown.Toggle>
        {/* Opciones del Usuario */}
        <Dropdown.Menu id='dropdown-user-menu'>
          <Dropdown.Item id='dropdown-user-item' onClick={handleConfigClick}>Configuración</Dropdown.Item>
          <Dropdown.Item id='dropdown-user-item' onClick={handleMyComicsClick}>Mis publicaciones</Dropdown.Item>
          <Dropdown.Item id='dropdown-user-item' onClick={handleWishListClick}>Lista de deseos</Dropdown.Item>
          <Dropdown.Item id='dropdown-user-item' onClick={handleOffersClick}>Bandeja de ofertas</Dropdown.Item>
          <Dropdown.Item id='dropdown-user-item' onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Modal de Publicar cómic */}
      <PublishComicModal
        show={showPublish}
        handleClose={() => setShowPublish(false)}
      />
    </div>
  );
};

export default UserButtons;