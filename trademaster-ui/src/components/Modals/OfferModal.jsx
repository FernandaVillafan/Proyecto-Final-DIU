import React, { useState } from 'react';
import './OfferModal.css';
import closeIcon from '../../images/close.png';
import axios from "axios";
import { useParams } from "react-router-dom";
// Importamos el archivo para los mensajes (alert)
import swalMessages from "../../services/SwalMessages";

const OfferModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    offerType: '',
    title: '',
    description: '',
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photos: [...formData.photos, ...e.target.files],
    });
  };

  const { comicId } = useParams();
  const [offer, setOffer] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Oferta enviada:', formData);
    const postComicOffer = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/comics/trade-offer/create/${comicId}/`,
                {
                    'service': formData.offerType,
                    'title': formData.title,
                    'description': formData.description
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            setOffer(response.data);
        } catch (error) {
            console.error("Error al mandar la oferta", error);
        }
    };
    postComicOffer();
    if(offer?.data?.id){
        swalMessages.successMessage("Tu oferta ha sido enviada exitosamente");
        console.log(formData.title);
        setFormData({
            offerType: '',
            title: '',
            description: '',
            photos: [],
          });
        onClose();
    }else{
        swalMessages.errorMessage(
            "Hubo un error al enviar la oferta<br>Inténtalo más tarde"
        );
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>Trueque</h1>
          <button className="close-button" onClick={onClose}>
            <img src={closeIcon} alt="" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="offerType">¿Qué ofreces a cambio? <span className="span-red">*</span></label>
            <select
              id="offerType"
              name="offerType"
              value={formData.offerType}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una opción...</option>
              <option value="Servicio">Servicio</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Título de la oferta <span className="span-red">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Nintendo Switch, Bicicleta"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción <span className="span-red">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe lo que ofreces..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="photos">Fotos (opcional)</label>
            <input
              type="file"
              id="photos"
              name="photos"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className='modal-footer'>
            <button type="submit" className="submit-button">Enviar propuesta</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default OfferModal;
