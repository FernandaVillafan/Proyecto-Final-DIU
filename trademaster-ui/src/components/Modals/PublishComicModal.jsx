import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

// Importamos el archivo CSS
import './PublishComicModal.css';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import priceIcon from '../../images/money.png';
import closeIcon from '../../images/close.png';
import uploadIcon from '../../images/upload.png';

const PublishComicModal = ({ show, handleClose, onComicPublished }) => {

    // Estados para el nuevo cómic
    const newComicState = {
        title: "",
        publisher: "",
        edition: "",
        condition: "",
        description: "",
        price: "",
        image: null,
        category: "",
    };
    const [newComic, setNewComic] = useState(newComicState);

    // Función para manejar el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComic({
            ...newComic,
            [name]: value,
        });
    };

    // Función para manejar las fotos
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setNewComic({
            ...newComic,
            image: file
        });
    };

    // Función para manejar el cierre del modal
    const handleModalClose = () => {
        setNewComic(newComicState);

        // También reseteamos el input de tipo file
        const fileInput = document.getElementById('photo-upload');
        if (fileInput) {
            fileInput.value = '';
        }

        handleClose();
    };

    // Función para publicar el nuevo cómic
    const handleSubmit = async () => {

        const token = localStorage.getItem("access_token");

        if (!token) return;

        // Validación de los campos requeridos
        if (
            !newComic.title || 
            !newComic.publisher || 
            !newComic.edition || 
            !newComic.condition || 
            !newComic.description ||
            !newComic.price || 
            !newComic.image ||
            !newComic.category
        ) {
            swalMessages.errorMessage("Por favor, completa todos los campos requeridos");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", newComic.title);
            formData.append("publisher", newComic.publisher);
            formData.append("edition", newComic.edition);
            formData.append("condition", newComic.condition);
            formData.append("description", newComic.description);
            formData.append("price", parseFloat(newComic.price));
            formData.append("image", newComic.image);
            formData.append("category", newComic.category);

            // Realizamos la solicitud POST al endpoint de crear comic
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comics/create/`, 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Verificamos que la respuesta sea exitosa
            if ((response.status === 201 || response.status === 200) && response.data) {
                // Mostramos un mensaje de éxito
                swalMessages.successMessage("Tu comic ha sido publicado exitosamente");
                if (onComicPublished) {
                    onComicPublished();
                }
                // Cerramos el modal
                handleModalClose();
            } else {
                swalMessages.errorMessage("Hubo un problema al publicar el comic");
            }
        } catch (error) {
            swalMessages.errorMessage("No se pudo publicar el comic<br>Por favor, inténtalo nuevamente");
            console.error('Error en handleSubmit: ', error);
        }
    };

    return (
        
        <Modal show={show} onHide={handleModalClose} centered>
            <Modal.Header className='border-0'>
                {/* Título del modal */}
                <Modal.Title>Nuevo Comic</Modal.Title>
                {/* Botón para cerrar el modal */}
                <span className='span-btn-close-publish' onClick={handleModalClose}>
                    <img src={closeIcon} className='btn-close' alt="..." />
                </span>
            </Modal.Header>

            <Modal.Body>
                <Form className='publish-form'>
                    <div className='form-group-div'>
                        {/* Título del cómic */}
                        <Form.Group className="publish-form-group">
                            <Form.Label>Título del comic <span className="span-red">*</span></Form.Label>

                            <Form.Control
                                type="text"
                                name="title"
                                value={newComic.title}
                                onChange={handleInputChange}
                                placeholder="Nombre del comic..."
                            />
                        </Form.Group>

                        {/* Categoría del comic */}
                        <Form.Group className='publish-form-group'>
                            <Form.Label>Categoría <span className="span-red">*</span></Form.Label>

                            <Form.Select
                                name="category"
                                value={newComic.category}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>
                                    Selecciona una opción...
                                </option>
                                <option value="SuperComic">SuperComic</option>
                                <option value="Eclipse">Eclipse Entertainment</option>
                                <option value="Manga">Manga</option>
                                <option value="Independiente">Independiente</option>
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className='form-group-div'>
                        {/* Nombre de la editorial */}
                        <Form.Group className='publish-form-group'>
                            <Form.Label>Editorial <span className="span-red">*</span></Form.Label>

                            <Form.Control
                                type="text"
                                name="publisher"
                                value={newComic.publisher}
                                onChange={handleInputChange}
                                placeholder="Nombre de editorial..."
                            />
                        </Form.Group>

                        {/* Número de edición */}
                        <Form.Group className='publish-form-group'>
                            <Form.Label>Edición <span className="span-red">*</span></Form.Label>

                            <Form.Control
                                type="text"
                                name="edition"
                                value={newComic.edition}
                                onChange={handleInputChange}
                                placeholder="Número de edición..."
                            />
                        </Form.Group>
                    </div>

                    <div className='form-group-div'>
                        {/* Estado del comic */}
                        <Form.Group className='publish-form-group'>
                            <Form.Label>Estado <span className="span-red">*</span></Form.Label>
                            
                            <Form.Select
                                name="condition"
                                value={newComic.condition}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>
                                    Selecciona una opción...
                                </option>
                                <option value="Nuevo">Nuevo</option>
                                <option value="Semi-Nuevo">Semi-nuevo</option>
                                <option value="Usado">Usado</option>
                            </Form.Select>
                        </Form.Group>
                        
                        {/* Precio del comic */}
                        <Form.Group className='publish-form-group'>
                            <Form.Label>Precio <span className="span-red">*</span></Form.Label>

                            <div className="input-group">
                                <span className="input-group-text" id="price-addon">
                                    <img src={priceIcon} alt="..." className="input-icon" />
                                </span>

                                <Form.Control
                                    type="number"
                                    name="price"
                                    className="form-control rounded-input"
                                    value={newComic.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        </Form.Group>
                    </div>

                    {/* Descripción del comic */}
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción <span className="span-red">*</span></Form.Label>
                        
                        <Form.Control
                            as="textarea"
                            rows={1}
                            name="description"
                            value={newComic.description}
                            onChange={handleInputChange}
                            placeholder="Describe el comic..."
                        />
                    </Form.Group>

                    {/* Imagen del comic */}
                    <Form.Group className="mb-3">
                        <Form.Label>Foto(s) <span className="span-red">*</span></Form.Label>

                        <div className="image-upload-div">
                            <label 
                                htmlFor="photo-upload"
                            >
                                <img src={uploadIcon} alt="..." className='label-icon' />
                                Subir foto
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="d-none"
                                id="photo-upload"
                            />
                            <span>
                                {newComic.image ? newComic.image.name : 'Ninguna foto seleccionada'}
                            </span>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" className="btn-primary" onClick={handleSubmit}>
                    Publicar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PublishComicModal;