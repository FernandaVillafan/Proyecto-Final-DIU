import React, { useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

// Importamos el archivo CSS
import './ComicCard.css';

// Importamos el contexto
import { useComics } from '../../context/ComicsContext';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import favoriteIcon from '../../images/favorite.png';
import favoriteRedIcon from '../../images/red-heart.png';
import editIcon from '../../images/edit.png';
import detailsIcon from '../../images/details.png';
import deleteIcon from '../../images/delete.png';
import defaultImage from '../../images/default-comic.jpeg';

const ComicCard = ({ 
    comic,
    isWishListView = false,
    isMyComicsView = false
}) => {

    const navigate = useNavigate(); // Hook para manejar la navegación
    
    // Obtenemos los datos del contexto
    const { fetchInitialData, wishList, isAuthenticated } = useComics();
    const comicId = comic?.id || comic?.comic?.id;
    const isFavorite = useMemo(() => wishList.has(comicId), [wishList, comicId]);
    
    // Función para manejar el click en el ícono de favorito
    const handleFavoriteClick = useCallback(async () => {
        if (!isAuthenticated) {
            swalMessages.errorMessage("Tienes que iniciar sesión para realizar esta acción");
            return;
        }
        
        const token = localStorage.getItem("access_token");

        try {
            if (isWishListView) {
                // Mostramos el modal de confirmación
                const result = await swalMessages.confirmMessage();
                if (!result.isConfirmed) return;

                // Eliminamos de la wishlist
                // Realizamos la solicitud DELETE al endpoint de eliminar un cómic de la wishlist
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/comics/wishlist/delete/${comicId}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                // Verificamos que la respuesta sea exitosa
                if (response.status === 201 || response.status === 200) {
                    // Mostramos un mensaje de éxito
                    swalMessages.successMessage(response.data?.message);
                    // Obtenemos los datos de los cómics con la eliminación hecha
                    await fetchInitialData();
                }
            } else if (!isFavorite) {
                // Agregamos a la wishlist
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comics/wishlist/add/${comicId}/`, 
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                // Verificamos que la respuesta sea exitosa
                if (response.status === 201 || response.status === 200) {
                    // Mostramos un mensaje de éxito
                    swalMessages.successMessage(response.data?.message);
                    // Obtenemos los datos de los cómics con la inserción hecha
                    await fetchInitialData();
                }
            }
        } catch (error) {
            swalMessages.errorMessage(error.response?.data?.message);
            console.error('Error en handleFavoriteClick: ', error);
        }
    }, [comicId, isFavorite, isWishListView, fetchInitialData, isAuthenticated]);

    // Función para manejar el click en el botón de detalles
    const handleDetailsClick = useCallback(() => {
        if (!isAuthenticated) {
            swalMessages.errorMessage("Tienes que iniciar sesión para realizar esta acción");
            return;
        }
        // Navegación a la vista correspondiente
        navigate(`/details/${comicId}`);
    }, [comicId, navigate, isAuthenticated]);

    // Función para manejar el click en el botón de editar
    const handleEditClick = (() => {
        // Navegación a la vista correspondiente
        navigate(`/update-comic/${comicId}`);
    });

    const comicData = comic?.comic || comic;
    if (!comicData) return null;

    return (

        <div className="comic-info">
            {/* Imagen del cómic */}
            <div className="comic-image-container">
                <img 
                    src={comicData.image ? `${process.env.REACT_APP_API_URL}/${comicData.image}` : defaultImage} 
                    alt="..." 
                    className={comicData.image ? "comic-cover" : "default-image"}
                />
            </div>

            {/* Ícono de favorito */}
            <span 
                className="span-favorite"
                onClick={handleFavoriteClick}
                style={(isWishListView || isMyComicsView) 
                    ? { opacity: 0 } 
                    : {
                        cursor: isFavorite ? 'default' : 'pointer',
                        opacity: isFavorite ? 0.8 : 1,
                        pointerEvents: isFavorite ? 'none' : 'auto'
                    }
                }
            >
                <img 
                    src={isFavorite ? favoriteRedIcon : favoriteIcon}
                    alt="..." 
                    className="favorite-icon"
                />
            </span>

            {/* Datos del cómic */}
            <div className="comic-data">
                <p className="title-text">{comicData.title}</p>
                <p className="edition-text">Edición: {comicData.edition}</p>
                <p className="price-text">${comicData.price} MXN</p>
            </div>
                
            {isMyComicsView ? (
                <div className="btn-details-div">
                    {/* Botón para editar el cómic */}
                    <Button 
                        className="btn-secondary" 
                        onClick={handleEditClick}
                    >
                        Editar
                        <span>
                            <img src={editIcon} className='button-img' alt="..." />
                        </span>
                    </Button>
                </div>
            ) : (
                <div className="btn-details-div">
                    {/* Botón para ver detalles del cómic */}
                    <Button 
                        className="btn-secondary" 
                        onClick={handleDetailsClick}
                    >
                        Detalles
                        <span>
                            <img src={detailsIcon} className='button-img' alt="..." />
                        </span>
                    </Button>
                </div>
            )}

            {/* Botón de eliminar en la wishlist */}
            {isWishListView && (
                <div className="btn-delete-div">
                    <Button 
                        className="btn-danger"
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