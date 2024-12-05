import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To handle navigation
import "./OffersPage.css"; // CSS styles
import Navbar from "../Navbar/Navbar"; // Import your NavBar component
import { Button } from "react-bootstrap";
import backIcon from "../../images/back.png";
import axios from "axios";

const OffersPage = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const navigate = useNavigate(); // Navigation hook
  const [isLoading, setIsLoading] = useState(true);

  // Fetch offers from the API
  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comics/trade-offers/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { trade_offers_as_seller, trade_offers_as_trader } =
        response.data.data;
      setReceivedOffers(trade_offers_as_seller || []);
      setSentOffers(trade_offers_as_trader || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the status of an offer
  const updateOfferStatus = async (offerId, status) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        return;
      }
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/comics/trade-offer/update/${offerId}/`,
        {
          status,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh offers after update
      fetchOffers();
    } catch (error) {
      console.error("Error updating offer status:", error);
    }
  };

  // Load offers when the component mounts
  useEffect(() => {
    fetchOffers();
  }, []);

  // Render offers based on the active tab
  const renderOffers = () => {
    const offers = activeTab === "received" ? receivedOffers : sentOffers;

    if (offers.length === 0) {
      return <p className="no-offers">No hay ofertas disponibles.</p>;
    }

    return offers.map((offer) => (
      <div key={offer.id} className="offer-card">
        <img
          src={offer.comic.image_url || "placeholder_image_url"}
          alt={offer.comic.title}
        />
        <div className="offer-content">
          <div className="offer-header">
            <h3>{`Oferta para: ${offer.comic.title}`}</h3>
            <p>{`De: ${offer.trader.name} ${offer.trader.last_name}`}</p>
          </div>
          <div className="offer-body">
            <p className="offer-title">{offer.title}</p>
            <p className="offer-description">{offer.description}</p>
            <p>{`El vendedor es: ${offer.seller.name} ${offer.seller.last_name}`}</p>
          </div>
          <div className="offer-footer">
            <p className="offer-date">
              <i className="far fa-calendar-alt"></i>{" "}
              {offer.created_at || "Fecha no disponible"}
            </p>
            <span
              className={`offer-status ${
                offer.status === 0
                  ? "pendiente"
                  : offer.status === 1
                  ? "aceptada"
                  : "rechazada"
              }`}
            >
              {offer.status === 0
                ? "Pendiente"
                : offer.status === 1
                ? "Aceptada"
                : "Rechazada"}
            </span>
            {activeTab === "received" && offer.status === 0 && (
              <div className="offer-actions">
                <button
                  className="reject-button"
                  onClick={() => updateOfferStatus(offer.id, 2)}
                >
                  Rechazar
                </button>
                <button
                  className="accept-button"
                  onClick={() => updateOfferStatus(offer.id, 1)}
                >
                  Aceptar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="offers-page">
      {/* Add the NavBar at the top */}
      <Navbar alternativeTitle="Bandeja de Ofertas" />

      {/* Botón de 'Volver' */}
      <div className="btn btn-back2-container">
        <Button className="btn-back2" onClick={() => navigate("/comics")}>
          <span>
            <img src={backIcon} className="btn-back-img" alt="..." />
          </span>
          Volver
        </Button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Recibidas ({receivedOffers.length})
        </button>
        <button
          className={`tab-button ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Enviadas ({sentOffers.length})
        </button>
      </div>

      {/* is loading */}
      {isLoading && <p className="loading-offers">Cargando...</p>}

      {/* List of offers */}
      {!isLoading && <div className="offers-list">{renderOffers()}</div>}
    </div>
  );
};

export default OffersPage;
