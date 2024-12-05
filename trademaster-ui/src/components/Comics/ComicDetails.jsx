import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap"; // Importamos Modal, Form y Button
import "./ComicDetails.css";
import Navbar from "../Navbar/Navbar";
import defaultComicImage from "../../images/comic01.jpg";
import backArrow from "../../images/back.png";
import starIcon from "../../images/star.png";
import heartIcon from "../../images/favorite.png";
import closeIcon from "../../images/close.png"; // Icono de cierre
import uploadIcon from "../../images/upload.png"; // Icono de subir imagen

const ComicDetails = () => {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false); // Estado para saber si es favorito
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [newOffer, setNewOffer] = useState({
    condition: "",
    title: "",
    description: "",
    image: null,
  }); // Estado para manejar los datos del formulario del modal

  // Fetch detalles del cómic
  useEffect(() => {
    const fetchComicDetails = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/comics/${comicId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComic(response.data);
      } catch (error) {
        console.error("Error al cargar los detalles del cómic:", error);
      }
    };

    fetchComicDetails();
  }, [comicId]);

  if (!comic) return <p>Cargando detalles del cómic...</p>;

  // Manejar apertura y cierre del modal
  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // Manejar los cambios en el formulario del modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la subida de imágenes
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewOffer((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");

    // Validación de campos obligatorios
    if (!newOffer.condition || !newOffer.title || !newOffer.description) {
      alert("Por favor, llena todos los campos obligatorios.");
      return;
    }

    // Crear el objeto para enviar en la solicitud
    const offerData = {
      service: newOffer.condition,
      title: newOffer.title,
      description: newOffer.description,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comics/trade-offer/create/${comicId}/`,
        offerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Indicamos que es JSON
          },
        }
      );

      console.log("Oferta enviada:", response.data);
      alert("Tu oferta se ha enviado correctamente.");
      handleModalClose(); // Cerramos el modal después de enviar
      setNewOffer({ condition: "", title: "", description: "", image: null }); // Reiniciamos el formulario
    } catch (error) {
      console.error("Error al enviar la oferta:", error);
      alert("Hubo un error al enviar tu oferta. Inténtalo de nuevo.");
    }
  };

  // Validar propiedades opcionales
  const {
    title = comic.data.title || "Título no disponible",
    subtitle = "Subtitle",
    edition = comic.data.edition || "N/A",
    status = comic.data.condition || "Desconocido",
    publisher = comic.data.publisher || "Editorial desconocida",
    price = comic.data.price || "N/A",
    description = comic.data.description || "No hay descripción disponible.",
    creators = [],
    seller = { name: "Desconocido", trades: 0, rating: "N/A" },
  } = comic;

  return (
    <div>
      <Navbar alternativeTitle="Detalles del Cómic" />

      <div className="comic-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <div className="back-arrow">
            <img src={backArrow} alt="Volver" />
          </div>
          Volver
        </button>

        <div className="comic-details-header">
          <div className="comic-image">
            <img src={defaultComicImage} alt={title} />
          </div>

          <div className="comic-info">
            <div
              className="heart-icon-container"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <img
                src={heartIcon}
                alt="Añadir a favoritos"
                className={`heart-icon ${isFavorite ? "favorited" : ""}`}
              />
            </div>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <div className="comic-tags">
              <div className="tag">
                <div className="tag-title">Edición</div>
                <span>{edition}</span>
              </div>
              <div className="tag">
                <div className="tag-title">Estado</div>
                <span>{status}</span>
              </div>
              <div className="tag">
                <div className="tag-title">Editorial</div>
                <span>{publisher}</span>
              </div>
              <div className="tag">
                <div className="tag-title">Precio Ref.</div>
                <span>${price} MXN</span>
              </div>
            </div>
            <p className="comic-description">{description}</p>
            <p className="comic-creators">
              Creadores:{" "}
              {creators.length > 0 ? creators.join(", ") : "No disponibles"}
            </p>

            <div className="seller-info">
              <div className="seller-box">
                <p className="seller-name">Vendedor</p>
                <p>{seller.name}</p>
                <p className="seller-stats">{seller.trades} trueques</p>
                <span className="seller-rating">
                  <div className="star-icon">
                    <img src={starIcon} alt="Estrella" />
                    {seller.rating}
                  </div>
                </span>
              </div>
            </div>

            <button className="offer-button" onClick={handleModalOpen}>
              Ofertar
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header className="border-0">
          <Modal.Title>Trueque</Modal.Title>
          <span className="span-btn-close-publish" onClick={handleModalClose}>
            <img src={closeIcon} className="btn-close" alt="Cerrar" />
          </span>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                ¿Qué ofreces a cambio? <span className="span-red">*</span>
              </Form.Label>
              <Form.Select
                name="condition"
                value={newOffer.condition}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Selecciona una opción...
                </option>
                <option value="Servicio">Servicio</option>
                <option value="Producto">Producto</option>
                <option value="Usado">Usado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Título de la oferta <span className="span-red">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newOffer.title}
                onChange={handleInputChange}
                placeholder="Título de la oferta"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Descripción <span className="span-red">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newOffer.description}
                onChange={handleInputChange}
                placeholder="Describe tu oferta"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fotos (opcional)</Form.Label>
              <div className="image-upload-div">
                <label htmlFor="photo-upload">
                  <img src={uploadIcon} alt="Subir" className="label-icon" />
                  Subir foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="d-none"
                  id="photo-upload"
                />
                <span>
                  {newOffer.image
                    ? newOffer.image.name
                    : "Ninguna foto seleccionada"}
                </span>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Enviar oferta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComicDetails;
