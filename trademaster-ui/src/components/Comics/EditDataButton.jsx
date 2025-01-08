import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Button } from "react-bootstrap";

// Importamos el archivo CSS
import "./EditDataButton.css";

// Importamos el contexto
import { useComics } from "../../context/ComicsContext";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import dataIcon from "../../images/data.png";

const EditDataButton = ({ comicId }) => {

    // Obtenemos la información del contexto
    const { currentComic, fetchComicById, updateComicData } = useComics();

    // Estado para mostrar el modal
    const [showModal, setShowModal] = useState(false);

    // Estado para los datos del cómic
    const [formData, setFormData] = useState({
        title: "",
        publisher: "",
        edition: "",
        condition: "",
        description: "",
        price: "",
    });

    // Estado para manejar los campos del formulario
    const [hasChanges, setHasChanges] = useState(false);

    // Efecto para cargar los datos del cómic actual
    useEffect(() => {
        if (comicId) {
            fetchComicById(comicId);
        }
    }, [comicId, fetchComicById]);

    // Función para obtener los datos al cargar la página
    useEffect(() => {
        if (currentComic) {
            setFormData({
                title: currentComic.title || "",
                publisher: currentComic.publisher || "",
                edition: currentComic.edition || "",
                condition: currentComic.condition || "",
                description: currentComic.description || "",
                price: currentComic.price || "",
            });
        }
    }, [currentComic]);

    // Función para manejar el cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const newFormData = {
                ...prevFormData,
                [name]: value
            };

            // Verificamos si hay cambios
            const hasFieldChanges = Object.keys(newFormData).some((key) =>
                newFormData[key] !== (currentComic?.[key] || "")
            );

            // Actualizamos el estado de cambios
            setHasChanges(hasFieldChanges);

            return newFormData;
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault(); // Previene el envío del formulario por defecto

        // Verificamos si hay algún cambio
        if (!hasChanges || !comicId) return;

        const dataToUpdate = {};
        // Solo incluímos los campos que han cambiado
        Object.keys(formData).forEach(key => {
            if (formData[key] !== (currentComic?.[key] || "") && 
                formData[key] !== "") {
                dataToUpdate[key] = formData[key];
            }
        });
            
        try {
            // Realizamos la solicitud al endpoint utilizando el contexto
            const response = await updateComicData(comicId, dataToUpdate);
            // Mostramos el mensaje de éxito
            swalMessages.successMessage(response?.data?.message || response?.message);
            // Cerramos el modal
            setShowModal(false);
            // Limpiamos el formulario y los cambios
            setHasChanges(false);
        } catch (error) {
            swalMessages.errorMessage(error.response?.data?.message);
            console.error('Error en handleSubmit: ', error);
        }
    }, [formData, hasChanges, currentComic, comicId, updateComicData]);

    // Función para manejar el cierre del modal
    const handleModalClose = () => {
        setShowModal(false);
        // Restauramos los datos originales
        if (currentComic) {
            setFormData({
                title: currentComic.title || "",
                publisher: currentComic.publisher || "",
                edition: currentComic.edition || "",
                condition: currentComic.condition || "",
                description: currentComic.description || "",
                price: currentComic.price || "",
            });
        }
        setHasChanges(false);
    };

    return (
        
        <>
            {/* Botón para editar los datos */}
            <Button className="btn-edit" onClick={() => setShowModal(true)}>
                Editar datos
                <span>
                    <img src={dataIcon} className='button-img' alt="..." />
                </span>
            </Button>

            {/* Modal para editar los datos del cómic */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton className="border-0">
                    {/* Título del modal */}
                    <Modal.Title>Editar Datos</Modal.Title>
                </Modal.Header>

                {/* Inputs del modal */}
                <Modal.Body className="publish-modal-body">
                    <Form>
                        {/* Título del cómic */}
                        <Form.Group className="form-input" controlId="formtitle">
                            <Form.Label>Título del cómic</Form.Label>

                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Editorial */}
                        <Form.Group className="form-input" controlId="formpublisher">
                            <Form.Label>Editorial</Form.Label>

                            <Form.Control
                                type="text"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <div className="row">
                            {/* Edición */}
                            <div className="col-6">
                                <Form.Group className="form-input" controlId="formedition">
                                    <Form.Label>Edición</Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="edition"
                                        value={formData.edition}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>

                            {/* Precio */}
                            <div className="col-6">
                                <Form.Group className="form-input" controlId="formprice">
                                    <Form.Label>Precio</Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        {/* Estado */}
                        <Form.Group className="form-input" controlId="formcondition">
                            <Form.Label>Estado</Form.Label>

                            <Form.Select
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecciona una opción...</option>
                                {['Nuevo', 'Semi-nuevo', 'Usado'].map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Descripción */}
                        <Form.Group className="form-input" controlId="formdescription">
                            <Form.Label>Descripción</Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
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
    )
};

export default EditDataButton;