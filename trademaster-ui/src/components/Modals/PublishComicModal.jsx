import React, { useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// Importamos el archivo CSS
import './PublishComicModal.css';

// Importamos el contexto
import { useComics } from '../../context/ComicsContext';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import priceIcon from '../../images/money.png';
import uploadIcon from '../../images/upload.png';

// Constante con los tipos MIME permitidos por Django ImageField
const VALID_IMAGE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif']
};

const PublishComicModal = ({ show, handleClose }) => {

    // Obtenemos la información del contexto
    const { createComic } = useComics();

    // Estado para el nuevo cómic
    const [newComic, setNewComic] = useState({
        title: "",
        publisher: "",
        edition: "",
        condition: "",
        description: "",
        price: "",
        image: [],
        category: "",
    });
    
    // Para prevenir múltiples envíos
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función para manejar el formulario
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewComic(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    // Función para manejar las fotos
    const handleImageUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setNewComic(prevState => ({
                ...prevState,
                image: file
            })); 
        }
    }, []);

    // Función auxiliar para validar el tipo de imagen
    const isValidImageType = (file) => {
        return Object.keys(VALID_IMAGE_TYPES).includes(file.type);
    };

    // Función para resetear los campos del formulario
    const resetForm = () => {
        setNewComic({
            title: "",
            publisher: "",
            edition: "",
            condition: "",
            description: "",
            price: "",
            image: [],
            category: "",
        });
    };

    // Función para manejar el cierre del modal
    const handleModalClose = useCallback(() => {
        setIsSubmitting(false);
        handleClose();
        resetForm();
        // También reseteamos el input de tipo file
        const fileInput = document.getElementById('photo-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    }, [handleClose]);

    // Función para validar el formulario
    const validateForm = useCallback(() => {
        const requiredFields = [
            'title', 
            'publisher', 
            'edition', 
            'condition', 
            'description', 
            'price', 
            'image', 
            'category'
        ];
        const emptyFields = requiredFields.filter(field => !newComic[field]);
        // Si falta llenar algún campo o la imagen
        if (emptyFields.length > 0 || newComic.image.length === 0) {
            swalMessages.errorMessage("Por favor, completa todos los campos requeridos");
            return false;
        }
        // Si el formato de la imagen no es válido
        if (!isValidImageType(newComic.image)) {
            swalMessages.errorMessage("Por favor, selecciona una imagen válida (JPG, JPEG, PNG o GIF)");
            return false;
        }
        // Validamos que el precio sea mayor a 0
        if (parseFloat(newComic.price) <= 0) {
            swalMessages.errorMessage("El precio debe ser mayor a 0");
            return false;
        }
        // Validamos que el precio no sea mayor a 10 dígitos
        if (parseFloat(newComic.price) > 1000000000) {
            swalMessages.errorMessage("El precio no debe ser mayor 1 billón");
            return false;
        }

        return true;
    }, [newComic]);

    // Función para publicar el nuevo cómic
    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Realizamos la solicitud POST al endpoint de crear cómic
            const response = await createComic(newComic);
            // Mostramos un mensaje de éxito
            swalMessages.successMessage(response?.data?.message || response?.message);
            // Cerramos el modal
            handleModalClose();
        } catch (error) {
            swalMessages.errorMessage(error.response?.data?.message);
            console.error('Error en handleSubmit: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, newComic, validateForm, createComic, handleModalClose]);

    return (
        
        <Modal show={show} onHide={handleModalClose} centered>
            <Modal.Header closeButton={!isSubmitting} className='border-0'>
                {/* Título del modal */}
                <Modal.Title>Nuevo Cómic</Modal.Title>
            </Modal.Header>

            <Modal.Body className='publish-modal-body'>
                <Form className='publish-form' onSubmit={(e) => e.preventDefault()}>
                    <div className='form-group-div'>
                        {/* Título del cómic */}
                        <Form.Group className="publish-form-group">
                            <Form.Label>Título del cómic <span className="span-red">*</span></Form.Label>

                            <Form.Control
                                id="title"
                                type="text"
                                name="title"
                                value={newComic.title}
                                onChange={handleInputChange}
                                placeholder="Nombre del cómic..."
                            />
                        </Form.Group>

                        {/* Categoría del cómic */}
                        <Form.Group className='publish-form-group'>
                            <Form.Label>Categoría <span className="span-red">*</span></Form.Label>

                            <Form.Select
                                id="category"
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
                                id="publisher"
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
                                id="edition"
                                type="text"
                                name="edition"
                                value={newComic.edition}
                                onChange={handleInputChange}
                                placeholder="Número de edición..."
                            />
                        </Form.Group>
                    </div>

                    <div className='form-group-div'>
                        {/* Estado del cómic */}
                        <Form.Group className='publish-form-group'>
                            <Form.Label>Estado <span className="span-red">*</span></Form.Label>
                            
                            <Form.Select
                                id="condition"
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
                        
                        {/* Precio del cómic */}
                        <Form.Group className='publish-form-group'>
                            <Form.Label>Precio <span className="span-red">*</span></Form.Label>

                            <div className="input-group price-div">
                                <span className="input-group-text" id="price-addon">
                                    <img src={priceIcon} alt="..." className="input-icon" />
                                </span>

                                <Form.Control
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={newComic.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    pattern="^\d*\.?\d{0,2}$"
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            const formattedValue = parseFloat(e.target.value).toFixed(2);
                                            setNewComic(prevState => ({
                                                ...prevState,
                                                price: formattedValue,
                                            }));
                                        }
                                    }}
                                />
                            </div>
                        </Form.Group>
                    </div>

                    {/* Descripción del cómic */}
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción <span className="span-red">*</span></Form.Label>
                        
                        <Form.Control
                            id="description"
                            as="textarea"
                            rows={1}
                            name="description"
                            value={newComic.description}
                            onChange={handleInputChange}
                            placeholder="Describe el cómic..."
                        />
                    </Form.Group>

                    {/* Imagen del cómic */}
                    <Form.Group className="mb-3">
                        <Form.Label>Foto(s) <span className="span-red">*</span></Form.Label>

                        <div className="image-upload-div">
                            <label 
                                htmlFor="photo-upload"
                            >
                                <img src={uploadIcon} alt="..." className='label-icon' />
                                Subir fotos
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="d-none"
                                id="photo-upload"
                            />
                            
                            <span>
                                {newComic.image.length !== 0 ? newComic.image.name : 'Ninguna foto seleccionada'}
                            </span>
                        </div>
                    </Form.Group>
                </Form>

                {/* Botón para publicar el cómic */}
                <div className='d-flex justify-content-center publish-modal-btn'>
                    <Button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Publicando...' : 'Publicar'}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PublishComicModal;