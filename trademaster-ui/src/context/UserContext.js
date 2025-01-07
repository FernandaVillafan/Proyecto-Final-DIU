import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Creamos el contexto
export const UserContext = createContext();

// Función que provee el contexto
export const UserProvider = ({ children }) => {

    // Estado para controlar la información del usuario logueado
    const [userData, setUserData] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función auxiliar para obtener el token
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem("access_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);
    
    // Función para obtener los datos del usuario
    const fetchUserData = useCallback(async (force = false) => {
        if (!isAuthenticated && !force) {
            setUserData(null);
            return;
        }

        const headers = getAuthHeaders();
        if (!headers.Authorization) {
            setUserData(null);
            return;
        }

        setIsLoading(true);
        setError(null);
    
        try {
            // Realizamos la solicitud GET al endpoint de obtener al usuario
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/`, 
                { headers }
            );
            // Asignamos los datos obtenidos
            setUserData(data.data || data);
        } catch (error) {
            console.error("Error en fetchUserData: ", error);
            setError(error.response?.data?.message || error.message);
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders]);

    // Función para obtener los datos del usuario cuando está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
        } else {
            setUserData(null);
        }
    }, [isAuthenticated, fetchUserData]);

    // Función para actualizar los datos del usuario
    const updateUserData = useCallback(async (newData) => {
        if (!isAuthenticated || !newData) return;

        setIsLoading(true);
        setError(null);

        try {
            // Realizamos la solicitud PUT al endpoint de actualizar al usuario
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/update-user/`,
                newData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Obtenemos los datos del usuario con la actualización hecha
            await fetchUserData();
            return response.data;
        } catch (error) {
            setError("Error en updateUserData: ", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders, fetchUserData]);

    // Función para actualizar la imagen de perfil del usuario
    const updateUserImage = useCallback(async (newImage) => {
        if (!isAuthenticated || !newImage) return;

        setIsLoading(true);
        setError(null);

        try {
            // Realizamos la solicitud PUT al endpoint de actualizar al usuario (imagen)
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/update-image/`,
                newImage,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            // Obtenemos los datos del usuario con la actualización hecha
            await fetchUserData();
            return response.data;
        } catch (error) {
            setError("Error en updateUserImage: ", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, getAuthHeaders, fetchUserData]);

    const value = {
        userData,
        isLoading,
        error,
        isAuthenticated,
        fetchUserData,
        updateUserData,
        updateUserImage,
    };

    return (
        
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto del usuario
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};