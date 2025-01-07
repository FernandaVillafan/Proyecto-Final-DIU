import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Creamos el contexto
export const OffersContext = createContext();

// Función que provee el contexto
export const OffersProvider = ({ children }) => {

    // Estados para controlar la información de las ofertas
    const { isAuthenticated } = useContext(AuthContext);
    const [offersData, setOffersData] = useState({ received: [], sent: [] });
    const [currentOffer, setCurrentOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función auxiliar para obtener el token
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem("access_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    // Función para manejar errores de manera consistente
    const handleError = useCallback((customMessage, error) => {
        console.error(customMessage, error);
        setError(error.response?.data?.message || error.message);
        setIsLoading(false);
    }, []);

    // Función para obtener los datos de las ofertas enviadas y recibidas
    const fetchOffersData = useCallback(async () => {
        if (!isAuthenticated) {
            setOffersData({ received: [], sent: [] });
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Realizamos la solicitud GET al endpoint de obtener las ofertas
            const respose = await axios.get(`${process.env.REACT_APP_API_URL}/api/comics/trade-offers/`,
                {
                    headers: getAuthHeaders()
                }
            );
            // Asignamos los datos obtenidos
            const { trade_offers_as_seller, trade_offers_as_trader } = respose.data.data || respose.data;
            setOffersData({
                received: trade_offers_as_seller,
                sent: trade_offers_as_trader
            });
        } catch (error) {
            handleError("Error en fetchOffersData: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders, handleError]);

    // Función para cargar las ofertas al montar el componente
    useEffect(() => {
        if (isAuthenticated) {
            fetchOffersData();
        } else {
            setOffersData({ received: [], sent: [] });
            setCurrentOffer(null);
        }
    }, [isAuthenticated, fetchOffersData]);

    // Función para obtener una oferta específica por su ID
    const fetchOfferById = useCallback(async (offerId) => {
        if (!isAuthenticated || !offerId) {
            setCurrentOffer(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Realizamos la solicitud GET al endpoint de obtener una oferta por su ID
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comics/trade-offer/${offerId}`,
                {
                    headers: getAuthHeaders()
                }
            );
            // Asignamos los datos obtenidos
            setCurrentOffer(response.data.data || response.data);
        } catch (error) {
            handleError("Error en fetchOfferById: ", error);
            setCurrentOffer(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders, handleError]);

    // Función para actualizar el estatus de una oferta
    const updateOfferStatus = useCallback(async (offerId, status) => {
        if (!isAuthenticated || !offerId) return;

        setIsLoading(true);
        setError(null);

        try {
            // Realizamos la solicitud PUT al endpoint de actualizar el estatus de la oferta
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/comics/trade-offer/update/${offerId}/`,
                { status },
                {
                    headers: getAuthHeaders()
                }
            );
            // Obtenemos los datos de las ofertas con la actualización hecha
            await fetchOffersData();
            return response.data;
        } catch (error) {
            handleError("Error en updateOfferStatus: ", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders, fetchOffersData, handleError]);

    // Función para crear una oferta 
    const createOffer = useCallback(async (comicId, newOffer) => {
        if (!isAuthenticated || !comicId) return;

        setIsLoading(true);
        setError(null);
        
        try {
            // Creamos el objeto FormData para mandar los datos al endpoint
            const formData = new FormData();
            Object.entries(newOffer).forEach(([key, value]) => {
                // Solo agregamos la imagen si está presente y no está vacía
                if (key === 'image' && !value) return;
                formData.append(key, value);
            });
            // Realizamos la solicitud POST al endpoint de crear una oferta
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comics/trade-offer/create/${comicId}/`,
                formData,
                {
                    headers: getAuthHeaders()
                }
            );
            // Obtenemos los datos de las ofertas con la inserción hecha
            await fetchOffersData();
            return response.data;
        } catch (error) {
            handleError("Error en createOffer: ", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders, fetchOffersData, handleError]);

    const value = {
        offers: offersData,
        receivedOffers: offersData.received,
        sentOffers: offersData.sent,
        currentOffer,
        isLoading,
        error,
        fetchOffersData,
        fetchOfferById,
        updateOfferStatus,
        createOffer,
        clearCurrentOffer: useCallback(() => setCurrentOffer(null), [])
    };

    return (

        <OffersContext.Provider value={value}>
            {children}
        </OffersContext.Provider>
    );
};

// Hook personalizado para usar el contexto de las ofertas
export const useOffers = () => {
    const context = useContext(OffersContext);
    if (!context) {
        throw new Error('useOffers debe ser usado dentro de un OffersProvider');
    }
    return context;
};