import React, { useState } from "react";
import { Button } from "react-bootstrap";

// Importamos los íconos (imágenes png)
import dataIcon from "../../images/data.png";

const EditDataButton = () => {

    // Estado para mostrar el modal
    const [showModal, setShowModal] = useState(false);

    return (
        
        <>
            {/* Botón para editar los datos */}
            <Button className="btn-edit" onClick={() => setShowModal(true)}>
                Editar datos
                <span>
                    <img src={dataIcon} className='button-img' alt="..." />
                </span>
            </Button>
        </>
    )
};

export default EditDataButton;