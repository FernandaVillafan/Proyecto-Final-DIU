import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

// Importamos el archivo CSS
import "./ComicDetails.css";

// Importamos el contexto
import { useUser } from "../../context/UserContext";
import { useComics } from '../../context/ComicsContext';

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import OfferModal from "../Modals/OfferModal";

// Importamos los íconos (imágenes png)
import backIcon from "../../images/back.png";
import defaultImage from "../../images/default-comic.jpeg";
import favoriteIcon from "../../images/favorite.png";
import favoriteRedIcon from "../../images/red-heart.png";
import starIcon from "../../images/star.png";

const ComicDetails = () => {

  const navigate = useNavigate(); // Hook para manejar la navegación

  // Obtenemos el ID del cómic de la URL
  const { comicId } = useParams();
  
  // Obtenemos los datos del contexto
  const { userData } = useUser();
  const { currentComic, fetchComicById, clearCurrentComic, wishList } = useComics();
  const isFavorite = useMemo(() => wishList.has(Number(comicId)), [wishList, comicId]);

  // Estado para mostrar/ocultar el modal de Ofertar
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Función para cargar los datos al montar el componente
  useEffect(() => {
    fetchComicById(comicId);
    // Limpiamos los datos cuando el componente se desmonta
    return () => clearCurrentComic();
  }, [comicId, fetchComicById, clearCurrentComic]);

  return (

    <>
      {/* Componente Navbar */}
      <Navbar alternativeTitle="Detalles del Cómic" isComicDetailsView={true} />

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
                  
                  {/* Ícono de favorito */}
                  <div className="fav-icon-container">
                    <img
                      src={isFavorite ? favoriteRedIcon : favoriteIcon}
                      alt="..." 
                      className="fav-icon"
                    />
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

                <div className="row">
                  <div className="offer-button-container">
                    {/* Botón para ofertar */}
                    {(currentComic.seller.username !== userData?.username) && (
                      <Button className='btn-primary' onClick={() => setShowOfferModal(true)}>
                        Ofertar
                      </Button>
                    )}
                  </div>
                  
                  {/* Información del vendedor */}
                  <div className="seller-container">
                    {/* Nombre del vendedor */}
                    <div className="seller-name">
                      <span className="seller-name-title">Vendedor</span> <br />
                      <span className="seller-username">{currentComic.seller.username}</span>
                    </div>

                    {/* Número de trueques realizados */}
                    <div className="seller-stats">
                      <span>{currentComic.seller.trades_count} trueques</span>
                    </div>

                    {/* Rank de calificación */}
                    <span className="seller-rating">
                      <div className="star-icon">
                        <img src={starIcon} alt="..." />
                        {currentComic.seller.rating}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Trueque */}
      <OfferModal
        show={showOfferModal}
        handleClose={() => setShowOfferModal(false)}
        comicId={comicId}
      />
    </>
  );
};

export default ComicDetails;