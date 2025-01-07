import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

// Importamos el archivo CSS
import "./WishList.css";

// Importamos el contexto
import { useComics } from "../../context/ComicsContext";

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import ComicCard from "../Comics/ComicCard";

// Importamos los íconos (imágenes png)
import favoriteIcon from "../../images/favorite.png";
import backIcon from "../../images/back.png";

const WishList = () => {

  const navigate = useNavigate(); // Hook para manejar la navegación
  
  // Obtenemos los datos del contexto
  const { comicsData, wishList } = useComics();

  // Filtramos los cómics que están en la wishlist
  const wishListComics = comicsData.filter(comic => wishList.has(comic.id));

  // Función para renderizar los cards de cómics
  const renderComics = useMemo(() => {
    // Si no hay cómics en la wishlist
    if (!wishListComics || wishListComics.length === 0) {
      return <div className="no-comics-message">No hay cómics en tu lista de deseos</div>
    }

    return (

      <div className="comics-grid">
        {wishListComics.map((comic) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            isWishListView={true}
          />
        ))}
      </div>
    );
  }, [wishListComics]);

  return (

    <>
      {/* Componente Navbar */}
      <Navbar alternativeIcon={favoriteIcon} alternativeTitle={"Mi Lista de Deseos"} />

      {/* Botón de 'Volver' */}
      <div className="btn btn-back-container">
        <Button className="btn-back" onClick={() => navigate(-1)}>
          <span>
            <img src={backIcon} className="btn-back-img" alt="..." />
          </span>
          Volver
        </Button>
      </div>

      {/* Lista de cómics en la wishlist */}
      <div className="comics-section">{renderComics}</div>
    </>
  );
};

export default WishList;