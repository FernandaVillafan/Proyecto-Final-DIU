import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Creamos el contexto
export const ComicsContext = createContext();

// Función que provee el contexto
export const ComicsProvider = ({ children }) => {

    // Estados para controlar la información de los cómics
    const { isAuthenticated } = useContext(AuthContext);
    const [comicsData, setComicsData] = useState([]);
    const [wishList, setWishList] = useState(new Set());
    const [currentComic, setCurrentComic] = useState(null);
    const [viewType, setViewType] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función auxiliar para obtener el token
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem("access_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    // Función para obtener datos en paralelo
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Realizamos las peticiones en paralelo
            const promises = [axios.get(`${process.env.REACT_APP_API_URL}/api/comics/`)];

            // Solo agregamos la petición de la wishlist si el usuario está autenticado
            if (isAuthenticated) {
                promises.push(axios.get(`${process.env.REACT_APP_API_URL}/api/comics/wishlist/`,
                    {
                        headers: getAuthHeaders()
                    }
                ));
            }

            const [comicsResponse, wishlistResponse] = await Promise.all(promises);
            // Asignamos los datos obtenidos de la solicitud
            setComicsData(comicsResponse.data.data || []);
            setViewType('all');

            if (wishlistResponse) {
                const wishlistIds = new Set(
                    (Array.isArray(wishlistResponse.data.data) ? wishlistResponse.data.data : [])
                        .map(item => item.comic?.id || item.id)
                        .filter(Boolean)
                );
                // Asignamos los datos obtenidos de la solicitud
                setWishList(wishlistIds);
            }
        } catch (error) {
            console.error("Error en fetchInitialData: ", error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders]);

    // Función para cargar los datos iniciales al montar el componente
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData, isAuthenticated]);

    // Caché para cómics individuales
    const comicsCache = useCallback(() => {
        const cache = new Map();

        return {

            get: (id) => cache.get(id),
            set: (id, comic) => cache.set(id, comic),
            clear: () => cache.clear()
        }
    }, []);

    // Función para obtener los datos de un cómic por su ID
    const fetchComicById = useCallback(async (comicId) => {
        // Obtenemos el cómic del caché de cómics
        const cached = comicsCache().get(comicId);
        if (cached) {
            setCurrentComic(cached);
            return;
        }

        try {
            // Realizamos la solicitud GET al endpoint de obtener un cómic por su ID
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comics/${comicId}`,
                {
                    headers: getAuthHeaders()
                }
            );
            // Asignamos la información obtenida en el caché de cómics
            const comic = response.data.data;
            comicsCache().set(comicId, comic);
            setCurrentComic(comic);
        } catch (error) {
            console.error("Error en fetchComicById: ", error);
            setCurrentComic(null);
        }
    }, [comicsCache, getAuthHeaders]);

    // Función para crear un cómic
    const createComic = useCallback(async (newComic) => {
        if (!isAuthenticated || !newComic) return;

        setIsLoading(true);
        setError(null);

        try {
            // Creamos el objeto FormData para mandar los datos al endpoint
            const formData = new FormData();
            Object.entries(newComic).forEach(([key, value]) => {
                if (key === 'price') {
                    formData.append(key, parseFloat(value));
                } else {
                    formData.append(key, value);
                }
            });
            // Realizamos la solicitud POST al endpoint de crear un cómic
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comics/create/`, 
                formData,
                { 
                    headers: getAuthHeaders()
                }
            );
            // Obtenemos los datos de los cómics con la inserción hecha
            await fetchInitialData();
            return response.data;
        } catch (error) {
            setError("Error en createComic: ", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders, fetchInitialData]);

    // Función para obtener los cómics que ha publicado el usuario
    const fetchMyComics = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Realizamos la solicitud GET al endpoint de mis cómics
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comics/my-comics/`,
                {
                    headers: getAuthHeaders()
                }
            );
            // Asignamos los datos obtenidos 
            setComicsData(response.data.data || []);
            setViewType('myComics');
        } catch (error) {
            console.error("Error en fetchMyComics: ", error);
            setError(error);
            setComicsData([]);
        } finally {
            setIsLoading(false);
        }
    }, [getAuthHeaders]);

    // Función para resetear a la vista general de cómics
    const resetToAllComics = useCallback(() => {
        setViewType('all');
        fetchInitialData();
    }, [fetchInitialData]);

    const value = {
        comicsData,
        wishList,
        currentComic,
        isLoading,
        error,
        isAuthenticated,
        viewType,
        fetchInitialData,
        fetchComicById,
        createComic,
        fetchMyComics,
        resetToAllComics,
        clearCurrentComic: useCallback(() => setCurrentComic(null), [])
    };

    return (

        <ComicsContext.Provider value={value}>
            {children}
        </ComicsContext.Provider>
    );
};

// Hook personalizado para usar el contexto de los cómics
export const useComics = () => {
    const context = useContext(ComicsContext);
    if (!context) {
        throw new Error('useComics debe ser usado dentro de un ComicsProvider');
    }
    return context;
};