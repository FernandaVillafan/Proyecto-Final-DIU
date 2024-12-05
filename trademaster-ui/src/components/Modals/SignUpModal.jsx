import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

// Importamos el archivo CSS
import './SignUpModal.css';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import nameIcon from '../../images/user.png';
import lastNameIcon from '../../images/user02.png';
import emailIcon from '../../images/mail.png';
import passwordIcon from '../../images/password.png';
import phoneIcon from '../../images/phone.png'
import usernameIcon from '../../images/username.png';
import closeIcon from '../../images/close.png';

const SignUpModal = ({ show, handleClose, setShowLogin }) => {

  // Estados para los datos ingresados
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');

  // Función para cerrar el modal de signup y abrir el de login
  const openLoginModal = () => {
    handleClose(); // Cierra el modal de signup
    setShowLogin(true); // Abre el modal de login
  };

  // Función para manejar el envío del formulario de registro
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto

    // Validamos que las contraseñas coincidan
    if (password !== confirmPassword) {
      swalMessages.errorMessage('Las contraseñas no coinciden<br>Inténtalo nuevamente');
      return;
    }

    try {
      // Realizamos la solicitud POST al endpoint de creación de usuario
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/create-user/`, {
        name: name,
        last_name: lastname,
        username: username,
        password: password,
        password_confirmation: confirmPassword,
        email: email,
        phone: phone,
      });

      // Comprobamos la respuesta
      if (response.data.message === "Usuario creado con éxito") {
        console.log('Registro exitoso:', response.data.message);

        // Limpiamos el formulario y cerramos el modal después del registro exitoso
        setName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setUsername('');
        handleClose();

        swalMessages.successMessage("Tu cuenta ha sido creada exitosamente");

        // Abrimos el modal de inicio de sesión después del registro
        setShowLogin(true);
      }
    } catch (error) {
      swalMessages.errorMessage("No se pudo completar el registro<br>Por favor, inténtalo nuevamente");
      console.error('Error en handleSubmit: ', error);
    }
  };

  // Función para manejar el cerrar el modal
  const handleCloseModal = () => {
    handleClose(); // Cierra el modal
    // Limpiamos las entradas al cerrar el modal
    setName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
    setUsername('');
  };

  return (

    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header className="border-0">
        {/* Título del modal */}
        <Modal.Title>Nuevo Usuario</Modal.Title>
        {/* Botón para cerrar el modal */}
        <span className='span-btn-close-signup' onClick={handleCloseModal}>
          <img src={closeIcon} className='btn-close' alt="..." />
        </span>
      </Modal.Header>

      <Modal.Body>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Nombre(s) del usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="name-addon">
              <img src={nameIcon} alt="..." className="input-icon" />
            </span>

            <input
              type="text"
              id="name"
              className="form-control rounded-input"
              placeholder="Nombre(s)"
              aria-label="Nombre(s)"
              aria-describedby="name-addon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Apellido(s) del usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="lastname-addon">
              <img src={lastNameIcon} alt="..." className="input-icon" />
            </span>

            <input
              type="text"
              id="lastname"
              className="form-control rounded-input"
              placeholder="Apellido(s)"
              aria-label="Apellido(s)"
              aria-describedby="lastname-addon"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Correo del usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="email-addon">
              <img src={emailIcon} alt="..." className="input-icon" />
            </span>

            <input
              type="email"
              id="email"
              className="form-control rounded-input"
              placeholder="Correo electrónico"
              aria-label="Correo electrónico"
              aria-describedby="email-addon"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Contraseña del usuario */}
          <div className="input-group mb-3">
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
              minLength={8}
            />
          </div>
          
          {/* Confirmar contraseña */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="confirm-password-addon">
              <img src={passwordIcon} alt="..." className="input-icon" />
            </span>

            <input
              type="password"
              id="confirmPassword"
              className="form-control rounded-input"
              placeholder="Confirmar contraseña"
              aria-label="Confirmar contraseña"
              aria-describedby="confirm-password-addon"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {/* Teléfono del usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="phone-addon">
              <img src={phoneIcon} alt="..." className="input-icon" />
            </span>

            <input
              type="tel"
              id="phone"
              className="form-control rounded-input"
              placeholder="Teléfono"
              aria-label="Teléfono"
              aria-describedby="phone-addon"
              value={phone}
              onChange={(e) => {
                // Solo se permiten números
                const value = e.target.value.replace(/\D/g, '');
                // Limitamos a 10 dígitos
                if (value.length <= 10) {
                  setPhone(value);
                }
              }}
              onKeyDown={(e) => {
                // Así prevenimos la entrada de teclas que no sean números
                const forbiddenKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];
                if (!forbiddenKeys.includes(e.key) && !/\d/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              pattern="[0-9]{10}"
              title="Debe ingresar un número de teléfono válido de 10 dígitos"
              maxLength={10}
              required
            />
          </div>

          {/* Nombre de usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="username-addon">
              <img src={usernameIcon} alt="..." className="input-icon" />
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
              minLength={8}
              maxLength={12}
            />
          </div>

          {/* Botón para enviar los datos ingresados */}
          <Button type="submit" className="btn-primary" variant="primary">
            Enviar
          </Button>
        </form>
      </Modal.Body>

      {/* Texto después del botón */}
      <Modal.Footer className="d-flex justify-content-center border-0">
        <span className="footer-text">
          ¿Ya tienes una cuenta?{" "}

          <span
            className="text-primary text-decoration-none"
            style={{ cursor: "pointer" }}
            onClick={openLoginModal}
          >
            Inicia sesión
          </span>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;