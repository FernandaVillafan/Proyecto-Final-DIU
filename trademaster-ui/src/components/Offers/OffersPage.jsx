import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

// Importamos el archivo CSS
import "./OffersPage.css"; 

// Importamos el contexto
import { useOffers } from "../../context/OffersContext";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";

// Importamos los íconos (imágenes png)
import backIcon from "../../images/back.png";
import offerIcon from "../../images/trade.png";
import defaultImage from "../../images/default-trade.jpeg";
import dateIcon from "../../images/calendar.png";

const OffersPage = () => {

  const navigate = useNavigate(); // Hook para manejar la navegación

  // Estado para manejar los dos tipos de ofertas (enviadas y recibidas)
  const [activeTab, setActiveTab] = useState("received");
  
  // Obtenemos los datos del contexto
  const { receivedOffers, sentOffers, updateOfferStatus } = useOffers();

  // Función para manejar el estatus de una oferta
  const handleStatusUpdate = useCallback(async (offerId, status) => {
    try {
      // Realizamos la solicitud al endpoint utilizando el contexto
      const response = await updateOfferStatus(offerId, status);
      // Mostramos el mensaje de éxito
      swalMessages.successMessage(response?.message);
    } catch (error) {
      swalMessages.errorMessage(error.response?.data?.message);
    }
  }, [updateOfferStatus]);

  // Función para renderizar las ofertas
  const renderOffers = useMemo(() => {
    const offers = activeTab === "received" ? receivedOffers : sentOffers;
    // Si no hay ofertas aún
    if (offers.length === 0) {
      return <div className="no-comics-message">No hay ofertas disponibles</div>;
    }

    return offers.map((offer) => (

      <div key={offer.id} className="offer-card">
        {/* Imagen de la oferta */}
        <div className="offer-image-container">
          <img
            src={offer.image ? `${process.env.REACT_APP_API_URL}/${offer.image}` : defaultImage}
            alt="..."
          />
        </div>

        {/* Información de la oferta */}
        <div className="offer-details">
          <div className="row">
            {/* Producto del que se quiere ofertar */}
            <div className="col-md-6 product-container">
              <span>{`Oferta para: ${offer.comic.title}`}</span>
              <p>{`De: ${offer.trader.name} ${offer.trader.last_name}`}</p>
            </div>

            {/* Estatus de la oferta */}
            <div className="col-md-6 status-container">
              <span className={`offer-status 
                ${offer.status === 0 ? "pendiente" 
                                     : offer.status === 1 ? "aceptada"
                                                          : "rechazada"}`}>
                {offer.status === 0 ? "Pendiente"
                                    : offer.status === 1 ? "Aceptada"
                                                         : "Rechazada"}
              </span>
            </div>
          </div>

          {/* Información de lo que ofrecen en la oferta */}
          <div className="row">
            <div className="info-container">
              <span>{offer.title}</span>
              <p>{offer.description}</p>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-6 offer-actions">
              {/* Fecha en la que se hizo la oferta */}
              <span className="offer-date">
                <div className="date-icon">
                  <img src={dateIcon} alt="..." />
                  {offer.date || "Fecha no disponible"}
                </div>
              </span>
            </div>

            <div className="col-md-6 offer-buttons"> 
              {/* Botones de Aceptar y Rechazar */}
              {activeTab === "received" && offer.status === 0 && (
                <>
                  <Button className="btn-tertiary" onClick={() => handleStatusUpdate(offer.id, 2)}>
                    Rechazar
                  </Button>

                  <Button className="btn-primary" onClick={() => handleStatusUpdate(offer.id, 1)}>
                    Aceptar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  }, [activeTab, receivedOffers, sentOffers, handleStatusUpdate]);

  return (

    <>
      {/* Componente Navbar */}
      <Navbar alternativeIcon={offerIcon} alternativeTitle="Bandeja de Ofertas" />

      {/* Botón de 'Volver' */}
      <div className="btn btn-back-container">
        <Button className="btn-back" onClick={() => navigate(-1)}>
          <span>
            <img src={backIcon} className="btn-back-img" alt="..." />
          </span>
          Volver
        </Button>
      </div>

      <div className="offers-container">
        {/* Tabs de Ofertas */}
        <div className="offer-tabs">
          {/* Botón de ofertas recibidas */}
          <Button
            className={`tab-button ${activeTab === "received" ? "active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            Recibidas ({receivedOffers.length})
          </Button>

          {/* Botón de ofertas enviadas */}
          <Button
            className={`tab-button ${activeTab === "sent" ? "active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            Enviadas ({sentOffers.length})
          </Button>
        </div>

        {/* Lista de los cards de ofertas */}
        <div className="offer-list">{renderOffers}</div>
      </div>
    </>
  );
};

export default OffersPage;