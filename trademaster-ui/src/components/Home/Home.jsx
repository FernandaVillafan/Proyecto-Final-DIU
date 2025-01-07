import React from "react";
import { Helmet } from "react-helmet";

// Importamos el archivo CSS
import "./Home.css";

// Importamos el componente del navbar
import Navbar from "../Navbar/Navbar";

// Importamos el componente de los cards de cómics
import ComicsPage from "../Comics/ComicsPage";

// Importamos los íconos (imágenes png)
import homeImage from "../../images/home.jpeg";
import arrowDown from "../../images/arrow-down.png";
import comicsIcon from "../../images/book.png";

const Home = () => {

  return (

    <div className="home-container">
      {/* Nombre de la vista */}
      <Helmet>
        <title>TradeMaster - Home</title>
      </Helmet>

      {/* Componente Navbar */}
      <Navbar />

      {/* Imagen de portada */}
      <div className="home-image-container">
        <img src={homeImage} alt="..." />

        <div className="home-image-text">
          <p className="home-text">
            BIENVENID@ A TU <br /> PLATAFORMA LIBRE Y <br /> GRATUITA DE TRUEQUE
          </p>
        </div>

        <div className="home-image-arrow">
          <img src={arrowDown} alt="..." />
        </div>
      </div>

      {/* Sección de cómics */}
      <div className="new-comics-container">
        <span className="comics-span">
          <img src={comicsIcon} className="comics-icon" alt="..." />
          Cómics Recién Agregados
        </span>
      </div>

      {/* Componente ComicsPage */}
      <ComicsPage />
    </div>
  );
};

export default Home;