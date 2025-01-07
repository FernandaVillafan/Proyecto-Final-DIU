import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importamos el archivo CSS
import "./LoginModal.css";

// Importamos la autenticación
import { AuthContext } from "../../context/AuthContext";
import { useUser } from '../../context/UserContext';

// Importamos el archivo para los mensajes (alert)
import swalMessages from "../../services/SwalMessages";

// Importamos los íconos (imágenes png)
import userIcon from "../../images/user.png";
import passwordIcon from "../../images/password.png";

const LoginModal = ({ show, handleClose, setShowSignUp }) => {

  // Obtenemos los datos y la función de los contextos
  const { login } = useContext(AuthContext);
  const { updateUserData } = useUser();

  const navigate = useNavigate(); // Hook para manejar la navegación

  // Estados de los datos en el modal
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Función para manejar el envío del formulario de inicio de sesión
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto

    try {
      // Realizamos la solicitud POST al endpoint de login
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login/`, {
        username: username,
        password: password,
      });

      const { access } = response.data; // Extraemos el access token de la respuesta

      // Almacenamos el access token en localStorage
      localStorage.setItem("access_token", access);

      // Actualizamos el estado de la autenticación global usando la función login
      login(access);

      // Obtenemos los datos del usuario y actualizamos el contexto
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      updateUserData(userResponse.data.data);

      // Limpiamos los campos del formulario y cerramos el modal
      setUsername("");
      setPassword("");
      handleClose();
      // Navegación a la siguiente vista
      navigate("/comics");
    } catch (error) {
      swalMessages.errorMessage(error.response?.data?.message);
      console.error('Error en handleSubmit: ', error);
    }
  };

  // Función para manejar el cerrar el modal
  const handleCloseModal = () => {
    handleClose(); // Cerramos el modal
    // Limpiamos las entradas al cerrar el modal
    setUsername("");
    setPassword("");
  };

  return (

    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton className="border-0">
        {/* Título del modal */}
        <Modal.Title>Ingresar</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Input de username */}
          <div className="input-group username mb-3">
            <span className="input-group-text" id="username-addon">
              <img src={userIcon} alt="..." className="input-icon" />
            </span>

            <input
              type="text"
              id="username"
              className="form-control rounded-input"
              placeholder="Usuario"
              aria-label="Usuario"
              aria-describedby="username-addon"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Input de contraseña */}
          <div className="input-group password mb-3">
            <span className="input-group-text" id="password-addon">
              <img src={passwordIcon} alt="..." className="input-icon" />
            </span>

            <input
              type="password"
              id="password"
              className="form-control rounded-input"
              placeholder="Contraseña"
              aria-label="Contraseña"
              aria-describedby="password-addon"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón para iniciar sesión */}
          <Button type="submit" className="btn-primary">
            Iniciar sesión
          </Button>
        </form>
      </Modal.Body>

      {/* Texto después del botón */}
      <Modal.Footer className="d-flex justify-content-center border-0">
        <span className="footer-text">
          ¿No tienes una cuenta?{" "}
          <span
            className="text-primary text-decoration-none"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleCloseModal();
              setShowSignUp(true);
            }}
          >
            Regístrate
          </span>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;