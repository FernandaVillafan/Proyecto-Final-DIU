import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

// Importamos el contexto
import { useComics } from '../../context/ComicsContext';

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import EditDataButton from "./EditDataButton";
import EditImageButton from "./EditImageButton";

// Importamos los íconos (imágenes png)
import editIcon from "../../images/edit.png";
import backIcon from "../../images/back.png";
import defaultImage from "../../images/default-comic.jpeg";

const EditPage = () => {

    const navigate = useNavigate(); // Hook para manejar la navegación

    // Obtenemos el ID del cómic de la URL
    const { comicId } = useParams();
    
    // Obtenemos los datos del contexto
    const { currentComic, fetchComicById, clearCurrentComic } = useComics();

    // Función para cargar los datos al montar el componente
    useEffect(() => {
        fetchComicById(comicId);
        // Limpiamos los datos cuando el componente se desmonta
        return () => clearCurrentComic();
    }, [comicId, fetchComicById, clearCurrentComic]);

    return (

        <>
            {/* Componente Navbar */}
            <Navbar  
                alternativeIcon={editIcon} 
                alternativeTitle="Editar el Cómic"
                isEditComicView={true}
            />

            {/* Botón de 'Volver' */}
            <div className="btn btn-back-container">
                <Button className="btn-back" onClick={() => navigate(-1)}>
                    <span>
                        <img src={backIcon} className="btn-back-img" alt="..." />
                    </span>
                    Volver
                </Button>
            </div>

            {currentComic && (
                <div className="comic-details-container">
                    <div className="row">
                        <div className="col-md-4 comic-image-div">
                            {/* Imagen del cómic */}
                            <div className="d-inline-block">
                                <img 
                                    src={currentComic?.image ? `${process.env.REACT_APP_API_URL}/${currentComic.image}` : defaultImage}
                                    alt="..."
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultImage;
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-md-8">
                            {/* Datos del cómic */}
                            <div className="comic-details">
                                <div className="row">
                                    {/* Título del cómic */}
                                    <div className="title-container">
                                        <span>{currentComic.title}</span>
                                    </div>
                                </div>

                                <div className="comic-tags">
                                    {/* Número de edición */}
                                    <div className="tag">
                                        <div className="tag-title">Edición</div>
                                        <span>{currentComic.edition}</span>
                                    </div>

                                    {/* Estado del cómic */}
                                    <div className="tag">
                                        <div className="tag-title">Estado</div>
                                        <span>{currentComic.condition}</span>
                                    </div>

                                    {/* Nombre de la editorial */}
                                    <div className="tag">
                                        <div className="tag-title">Editorial</div>
                                        <span>{currentComic.publisher}</span>
                                    </div>
                                    
                                    {/* Precio del cómic */}
                                    <div className="tag">
                                        <div className="tag-title">Precio</div>
                                        <span>${currentComic.price} MXN</span>
                                    </div>
                                </div>

                                {/* Descripción del cómic */}
                                <div className="description-container">
                                    <span>{currentComic.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            {/* Botón para editar la imagen del cómic */}
                            <div className="buttons-container">
                                <EditImageButton />
                            </div>
                        </div>

                        <div className="col-md-8">
                            {/* Botón para editar los datos del cómic */}
                            <div className="buttons-container">
                                <EditDataButton />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditPage;