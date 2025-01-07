import React, { useState } from "react";
import { Button } from "react-bootstrap";

// Importamos los íconos (imágenes png)
import photoIcon from "../../images/photo.png";

const EditImageButton = () => {

    // Estado para mostrar el modal
    const [showModal, setShowModal] = useState(false);

    return (
        
        <>
            {/* Botón para editar la foto de perfil */}
            <Button className="btn-edit" onClick={() => setShowModal(true)}>
                Editar imagen
                <span>
                    <img src={photoIcon} className='button-img' alt="..." />
                </span>
            </Button>
        </>
    )
};

export default EditImageButton;