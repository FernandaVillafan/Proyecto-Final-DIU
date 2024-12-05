import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import './ComicCard.css';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import favoriteIcon from '../../images/favorite.png';
import favoriteRedIcon from '../../images/red-heart.png';
import detailsIcon from '../../images/details.png';
import deleteIcon from '../../images/delete.png';
import defaultImage from '../../images/default.jpeg';
import { useNavigate } from 'react-router-dom';

const ComicCard = ({ 
    comic, 
    isFavorite = false, 
    onWishListUpdate, 
    isWishListView = false
}) => {
    const navigate = useNavigate();
    // Función para manejar el click en el ícono de favorito
    const handleFavoriteClick = async () => {
        const token = localStorage.getItem("access_token");

        // Verificamos si existe el token antes de continuar
        if (!token) {
            swalMessages.errorMessage("Tienes que iniciar sesión para realizar esta acción");
            return;
        }

        const comicId = comic?.id || comic?.comic?.id;
        if (!comicId) return;

        try {
            if (isWishListView) {
                // Mostramos el modal de confirmación
                const result = await swalMessages.confirmMessage();
                if (!result.isConfirmed) return;

                // Eliminamos de la wishlist
                const response = await axios.delete(
                    `${process.env.REACT_APP_API_URL}/api/comics/wishlist/delete/${comicId}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data.message === "Comic deleted successfully") {
                    // Mostramos un mensaje de éxito
                    swalMessages.successMessage("¡Comic eliminado de tu lista de deseos!");
                    if (onWishListUpdate) onWishListUpdate();
                }
            } else if (!isFavorite) {
                // Agregamos a la wishlist
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/comics/wishlist/add/${comicId}/`, 
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data.message === "Comic added to wishlist") {
                    // Mostramos un mensaje de éxito
                    swalMessages.successMessage("¡Comic agregado a tu lista de deseos!");
                    if (onWishListUpdate) onWishListUpdate();
                }
            }
        } catch (error) {
            swalMessages.errorMessage(isWishListView ? 
                "No se pudo eliminar el comic de la lista de deseos" : 
                "No se pudo agregar el comic a la lista de deseos"
            );
            console.error('Error en handleFavoriteClick: ', error);
        }
    };

    const handleDetailsClick = async () => {
        const token = localStorage.getItem("access_token");

        // Verificamos si existe el token antes de continuar
        if (!token) {
            swalMessages.errorMessage("Tienes que iniciar sesión para realizar esta acción");
            return;
        }
    
        const comicId = comic?.id || comic?.comic?.id;

        if (comicId) {
            navigate(`/details/${comicId}`);
        } else {
            swalMessages.errorMessage("No se pudo cargar el detalle del cómic");
        }
    }

    // Asegurarse de que tengamos datos válidos antes de renderizar
    const comicData = comic?.comic || comic;
    if (!comicData) return null;

    return (

        <div className="comic-info">
            {/* Imagen del comic */}
            <div className="comic-image-container">
                {comicData.image ? (
                    <img 
                        src={`http://localhost:8000/${comicData.image}`} 
                        alt="..." 
                        className="comic-cover"
                    />
                ) : (
                    <img src={defaultImage} alt="..." className="default-image" />
                )}
            </div>

            {/* Icono de favorito */}
            {!isWishListView && (
                <span 
                    className="span-favorite"
                    onClick={handleFavoriteClick}
                    style={{ cursor: 'pointer' }}
                >
                    <img 
                        src={isFavorite ? favoriteRedIcon : favoriteIcon}
                        alt="..." 
                        className="favorite-icon"
                    />
                </span>
            )}

            {/* Datos del comic */}
            <div className="comic-data">
                <p className="title-text">{comicData.title}</p>
                <p className="edition-text">Edición: {comicData.edition}</p>
                <p className="price-text">${comicData.price} MXN</p>
            </div>

            {/* Botón para ver detalles del comic */}
            <div className="btn-details-div">
                <Button 
                    className="btn-secondary" 
                    variant="secondary"
                    onClick={handleDetailsClick}
                >
                    Detalles
                    <span>
                        <img src={detailsIcon} className='button-img' alt="..." />
                    </span>
                </Button>
            </div>

            {/* Botón de eliminar en la wishlist */}
            {isWishListView && (
                <div className="btn-delete-div">
                    <Button 
                        className="btn-danger"
                        variant="secondary"
                        onClick={handleFavoriteClick}
                    >
                        Eliminar
                        <span>
                            <img src={deleteIcon} className='button-img' alt="..." />
                        </span>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ComicCard;