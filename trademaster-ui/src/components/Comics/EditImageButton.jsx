import React, { useState, useCallback } from "react";
import { Button, Modal } from "react-bootstrap";

// Importamos el contexto
import { useComics } from "../../context/ComicsContext";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import uploadIcon from '../../images/upload.png';
import photoIcon from "../../images/photo.png";

const EditImageButton = ({ comicId }) => {

    // Obtenemos los datos del contexto
    const { updateComicImage } = useComics();

    // Estado para mostrar el modal
    const [showModal, setShowModal] = useState(false);

    // Estado para la imagen seleccionada
    const [selectedImage, setSelectedImage] = useState(null);

    // Estado para el nombre del archivo
    const [fileName, setFileName] = useState('Ninguna imagen seleccionada');

    // Función para cambiar la imagen del cómic
    const handleSubmit = useCallback(async () => {
        // Creamos el objeto FormData para mandar los datos al endpoint
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            // Realizamos la solicitud al endpoint utilizando el contexto
            const response = await updateComicImage(comicId, formData);
            // Mostramos el mensaje de éxito
            swalMessages.successMessage(response?.data?.message || response?.message);
            // Cerramos el modal
            setShowModal(false);
            // Reseteamos los campos del formulario
            setSelectedImage(null);
            setFileName('Ninguna imagen seleccionada');
        } catch (error) {
            swalMessages.errorMessage(error.response?.data?.message);
            console.error('Error en handleSubmit: ', error);
        }
    }, [selectedImage, comicId, updateComicImage]);

    return (
        
        <>
            {/* Botón para editar la imagen del cómic */}
            <Button className="btn-edit" onClick={() => setShowModal(true)}>
                Editar imagen
                <span>
                    <img src={photoIcon} className='button-img' alt="..." />
                </span>
            </Button>

            {/* Modal para editar la imagen del cómic */}
            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                setSelectedImage(null);
                setFileName('Ninguna imagen seleccionada');
            }} centered>
                <Modal.Header closeButton className="border-0">
                    {/* Título del modal */}
                    <Modal.Title>Editar Imagen</Modal.Title>
                </Modal.Header>

                {/* Sección para elegir una imagen */}
                <Modal.Body className="publish-modal-body">
                    <div className="image-upload-div">
                        <label htmlFor="photo-upload">
                            <img src={uploadIcon} alt="..." className='icon' />
                            <span>
                                Subir fotos
                            </span>
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setSelectedImage(file);
                                    setFileName(file.name);
                                }
                            }}
                            className="d-none"
                            id="photo-upload"
                        />
                        
                        <span className="file-name mt-2 d-block">{fileName}</span>
                    </div>
                </Modal.Body>

                {/* Botón para enviar la imagen seleccionada */}
                <Modal.Footer className="border-0">
                    <div className='d-flex justify-content-center edit-modal-btn'>
                        <Button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={!selectedImage}
                        >
                            Enviar
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
};

export default EditImageButton;