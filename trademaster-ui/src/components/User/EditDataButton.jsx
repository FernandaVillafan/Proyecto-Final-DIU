import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Button } from "react-bootstrap";

// Importamos el archivo CSS
import "./EditDataButton.css";

// Importamos el contexto
import { useUser } from "../../context/UserContext";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import dataIcon from "../../images/data.png";

const EditDataButton = () => {

    // Obtenemos la información del contexto
    const { userData, updateUserData } = useUser();

    // Estado para mostrar el modal
    const [showModal, setShowModal] = useState(false);

    // Estado para los datos del usuario
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        phone: "",
        username: ""
    });

    // Estado para manejar los campos del formulario
    const [hasChanges, setHasChanges] = useState(false);

    // Función para obtener los datos al cargar la página
    useEffect(() => {
        if (userData) {
            setFormData ({
                name: userData.name || "",
                last_name: userData.last_name || "",
                email: userData.email || "",
                password: "",
                confirm_password: "",
                phone: userData.phone || "",
                username: userData.username || ""
            });
        }
    }, [userData]);

    // Función para manejar el cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const newFormData = {
                ...prevFormData,
                [name]: value
            };

            // Verificamos si hay cambios en campos distintos a la contraseña
            const hasFieldChanges = Object.keys(newFormData).some((key) =>
                key !== "password" &&
                key !== "confirm_password" &&
                newFormData[key] !== (userData?.[key] || "")
            );

            // Verificamos si los campos de la contraseña han cambiado
            const hasPasswordChanges = newFormData.password !== "" || newFormData.confirm_password !== "";

            // Actualizamos el estado de cambios
            setHasChanges(hasFieldChanges || hasPasswordChanges);

            return newFormData;
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault(); // Previene el envío del formulario por defecto

        // Verificamos si hay algún cambio
        if (!hasChanges) return;

        // Verificamos los campos de contraseña (si se quiere cambiar este campo)
        if (formData.password && formData.password !== formData.confirm_password) {
            swalMessages.errorMessage("Las contraseñas no coinciden");
            return;
        }

        const dataToUpdate = {};
        // Solo incluímos los campos que han cambiado
        Object.keys(formData).forEach(key => {
            if (key !== 'confirm_password' && 
                formData[key] !== (userData?.[key] || "") && 
                formData[key] !== "") {
                dataToUpdate[key] = formData[key];
            }
        });

        // Si el campo "password" existe en `dataToUpdate`, agregamos confirm_password
        if (dataToUpdate.password) {
            dataToUpdate.confirm_password = formData.confirm_password;
        }
            
        try {
            // Realizamos la solicitud al endpoint utilizando el contexto
            const response = await updateUserData(dataToUpdate);
            // Mostramos el mensaje de éxito
            swalMessages.successMessage(response?.data?.message || response?.message);
            // Cerramos el modal
            setShowModal(false);
            // Limpiamos el formulario
            setFormData(prevState => ({
                ...prevState,
                password: "",
                confirm_password: ""
            }));
            setHasChanges(false);
        } catch (error) {
            swalMessages.errorMessage(error.response?.data?.message);
            console.error('Error en handleSubmit: ', error);
        }
    }, [formData, hasChanges, userData, updateUserData]);

    return (

        <>
            {/* Botón para editar los datos */}
            <Button className="btn-edit" onClick={() => setShowModal(true)}>
                Editar datos
                <span>
                    <img src={dataIcon} className='button-img' alt="..." />
                </span>
            </Button>

            {/* Modal para editar los datos del usuario */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    {/* Título del modal */}
                    <Modal.Title>Editar Datos</Modal.Title>
                </Modal.Header>

                {/* Inputs del modal */}
                <Modal.Body className="publish-modal-body">
                    <Form>
                        {[
                            { id: 'name',             label: 'Nombre(s)',            type: 'text' },
                            { id: 'last_name',        label: 'Apellido(s)',          type: 'text' },
                            { id: 'email',            label: 'Correo electrónico',   type: 'email' },
                            { id: 'password',         label: 'Contraseña',           type: 'password' },
                            { id: 'confirm_password', label: 'Confirmar contraseña', type: 'password' },
                            { id: 'phone',            label: 'Teléfono',             type: 'phone' },
                            { id: 'username',         label: 'Usuario',              type: 'text' }
                        ].map(field => (
                            <Form.Group key={field.id} className="form-input" controlId={`form${field.id}`}>
                                <Form.Label>{field.label}</Form.Label>

                                <Form.Control
                                    type={field.type}
                                    name={field.id}
                                    value={formData[field.id]}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>

                {/* Botón para enviar los datos ingresados */}
                <Modal.Footer className="border-0">
                    <div className='d-flex justify-content-center edit-modal-btn'>
                        <Button 
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={!hasChanges}
                        >
                            Enviar
                        </Button> 
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditDataButton;