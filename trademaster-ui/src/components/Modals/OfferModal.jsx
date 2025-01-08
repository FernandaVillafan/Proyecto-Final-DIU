import React, { useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// Importamos el archivo CSS
import './OfferModal.css';

// Importamos el contexto
import { useOffers } from '../../context/OffersContext';

// Importamos el archivo para los mensajes (alert)
import swalMessages from "../../services/SwalMessages";

// Importamos los íconos (imágenes png)
import uploadIcon from '../../images/upload.png';

// Constante con los tipos MIME permitidos por Django ImageField
const VALID_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif']
};

const OfferModal = ({ show, handleClose, comicId }) => {

  // Obtenemos los datos del contexto
  const { createOffer } = useOffers();

  // Estado para una nueva oferta
  const [newOffer, setNewOffer] = useState({
    offerType: "",
    title: "",
    description: "",
    image: [],
  });

  // Para prevenir múltiples envíos
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para manejar el formulario
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewOffer(prevState => ({ 
      ...prevState, 
      [name]: value,
    }));
  }, []);

  // Función para manejar las fotos
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setNewOffer(prevState => ({
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
    setNewOffer({
      offerType: "",
      title: "",
      description: "",
      image: [],
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

  // Función para validar los campos del formulario
  const validateForm = useCallback(() => {
    const requiredFields = [
      'offerType',
      'title',
      'description',
    ];
    const emptyFields = requiredFields.filter(field => !newOffer[field]);
    // Si falta llenar algún campo
    if (emptyFields.length > 0) {
      swalMessages.errorMessage("Por favor, completa todos los campos requeridos");
      return false;
    }

    // Si se sube una imagen, validamos el formato
    if (!isValidImageType(newOffer.image)) {
      swalMessages.errorMessage("Por favor, selecciona una imagen válida (JPG, JPEG, PNG o GIF)");
      return false;
    }

    return true;
  }, [newOffer]);

  // Función para mandar la oferta
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Realizamos la solicitud POST al endpoint de crear oferta
      const response = await createOffer(comicId, newOffer);
      // Mostramos un mensaje de éxito
      swalMessages.successMessage(response?.message);
      // Cerramos el modal
      handleModalClose();
    } catch (error) {
      swalMessages.errorMessage(error.response?.data?.message);
      console.error('Error en handleSubmit: ', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, newOffer, validateForm, handleModalClose, createOffer, comicId]);

  return (

    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton={!isSubmitting} className='border-0'>
        {/* Título del modal */}
        <Modal.Title>Trueque</Modal.Title>
      </Modal.Header>

      <Modal.Body className='publish-modal-body'>
        <Form className='trade-form' onSubmit={(e) => e.preventDefault()}>
          <>
            {/* Qué ofreces a cambio */}
            <Form.Group className='trade-form-group'>
              <Form.Label>¿Qué ofreces a cambio? <span className="span-red">*</span></Form.Label>

              <Form.Select
                id="offerType"
                name="offerType"
                value={newOffer.offerType}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Selecciona una opción...
                </option>
                <option value="servicio">Servicio</option>
                <option value="producto">Producto</option>
              </Form.Select>
            </Form.Group>

            {/* Título de la oferta */}
            <Form.Group className="trade-form-group">
              <Form.Label>Título de la oferta <span className="span-red">*</span></Form.Label>

              <Form.Control
                id="title"
                type="text"
                name="title"
                value={newOffer.title}
                onChange={handleInputChange}
                placeholder="Ejemplo: Nintendo Switch, Bicicleta..."
              />
            </Form.Group>

            {/* Descripción de la oferta */}
            <Form.Group className="mb-3">
              <Form.Label>Descripción <span className="span-red">*</span></Form.Label>
                
              <Form.Control
                id="description"
                as="textarea"
                rows={1}
                name="description"
                value={newOffer.description}
                onChange={handleInputChange}
                placeholder="Describe lo que ofreces..."
              />
            </Form.Group>

            {/* Imágenes de la oferta (opcionales) */}
            <Form.Group className="mb-3">
              <Form.Label>Fotos (opcional)</Form.Label>

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
                  {newOffer.image.length !== 0 ? newOffer.image.name : 'Ninguna foto seleccionada'}
                </span>
              </div>
            </Form.Group>
          </>
        </Form>
        
        {/* Botón para envíar la propuesta */}
        <div className='d-flex justify-content-center publish-modal-btn'>
          <Button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar propuesta'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OfferModal;