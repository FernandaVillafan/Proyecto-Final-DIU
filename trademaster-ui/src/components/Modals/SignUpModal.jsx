import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

// Importamos el archivo CSS
import './SignUpModal.css';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import nameIcon from '../../images/user.png';
import lastnameIcon from '../../images/user02.png';
import emailIcon from '../../images/mail.png';
import passwordIcon from '../../images/password.png';
import phoneIcon from '../../images/phone.png'
import usernameIcon from '../../images/username.png';

const SignUpModal = ({ show, handleClose, setShowLogin }) => {

  // Estados para los datos ingresados
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    username: ''
  });

  // Función para manejar los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Para el campo de teléfono, solo se permiten números y limitamos a 10 dígitos
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prevState => ({
          ...prevState,
          [name]: numericValue
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Función para resetear los campos del formulario
  const resetForm = () => {
    setFormData({
      name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      phone: '',
      username: ''
    });
  };

  // Función para manejar el envío del formulario de registro
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto

    try {
      // Realizamos la solicitud POST al endpoint de creación de usuario
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/create-user/`, 
        formData
      );
      // Verificamos que la respuesta sea exitosa
      if (response.status === 201 || response.status === 200) {
        // Limpiamos el formulario y cerramos el modal después del registro exitoso
        resetForm();
        handleClose();
        // Mostramos un mensaje de éxito
        swalMessages.successMessage(response.data?.message);
        // Abrimos el modal de inicio de sesión después del registro
        setShowLogin(true);
      }
    } catch (error) {
      swalMessages.errorMessage(error.response?.data?.message);
      console.error('Error en handleSubmit: ', error);
    }
  };

  // Función para cerrar el modal del registro
  const handleCloseModal = () => {
    handleClose(); // Cerramos el modal
    // Limpiamos las entradas al cerrar el modal
    resetForm();
  };

  return (

    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton className="border-0">
        {/* Título del modal */}
        <Modal.Title>Nuevo Usuario</Modal.Title>
      </Modal.Header>

      {/* Inputs del modal */}
      <Modal.Body>
        <form className="login-form" onSubmit={handleSubmit}>
          {[
            { id: 'name',             icon: nameIcon,     placeholder: 'Nombre(s)',            type: 'text' },
            { id: 'last_name',        icon: lastnameIcon, placeholder: 'Apellido(s)',          type: 'text' },
            { id: 'email',            icon: emailIcon,    placeholder: 'Correo electrónico',   type: 'email' },
            { id: 'password',         icon: passwordIcon, placeholder: 'Contraseña',           type: 'password', minLength: 8 },
            { id: 'confirm_password', icon: passwordIcon, placeholder: 'Confirmar contraseña', type: 'password', minLength: 8 },
            { id: 'phone',            icon: phoneIcon,    placeholder: 'Teléfono',             type: 'tel',      maxLength: 10 },
            { id: 'username',         icon: usernameIcon, placeholder: 'Usuario',              type: 'text',     minLength: 8, maxLength: 12 }
          ].map((field) => (
            <div className="input-group mb-2" key={field.id}>
              <span className="input-group-text" id={`${field.id}-addon`}>
                <img src={field.icon} alt="..." className="input-icon" />
              </span>

              <input
                type={field.type}
                id={field.id}
                name={field.id}
                className="form-control rounded-input"
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={handleInputChange}
                onKeyDown={field.id === 'phone' ? (e) => {
                  const forbiddenKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];
                  if (!forbiddenKeys.includes(e.key) && !/\d/.test(e.key)) {
                    e.preventDefault();
                  }
                } : undefined}
                required
                minLength={field.minLength}
                maxLength={field.maxLength}
                pattern={field.id === 'phone' ? "[0-9]{10}" : undefined}
                title={field.id === 'phone' ? "Debes ingresar un número de teléfono de 10 dígitos" : undefined}
              />
            </div>
          ))}

          {/* Botón para enviar los datos ingresados */}
          <Button type="submit" className='btn-primary'>
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
            onClick={() => {
              handleCloseModal();
              setShowLogin(true);
            }}
          >
            Inicia sesión
          </span>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;