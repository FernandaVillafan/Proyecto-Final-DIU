import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

// Importamos el contexto
import { useComics } from '../../context/ComicsContext';

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import ComicCard from "./ComicCard";

// Importamos los íconos (imágenes png)
import backIcon from "../../images/back.png";

const MyComics = () => {

    const navigate = useNavigate(); // Hook para manejar la navegación

    // Obtenemos los datos y funciones del contexto
    const { comicsData, fetchMyComics, resetToAllComics } = useComics();

    // Estado para manejar la barra de búsqueda
    const searchTerm = useSelector((state) => state.search.searchTerm);

    // Función para obtener los cómics filtrados por la barra de búsqueda
    const filteredComics = useMemo(() => {
        let filtered = comicsData;
        // Aplicamos la búsqueda
        if (searchTerm) {
            filtered = comicsData.filter(
                comic => comic.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered
    }, [comicsData, searchTerm]);

    // Función para cargar los datos de los cómics
    useEffect(() => {
        fetchMyComics();
    }, [fetchMyComics]);

    // Función para renderizar los cards de cómics
    const renderComics = useMemo(() => {
        // Si no hay cómics publicados por el usuario
        if (!comicsData || comicsData.length === 0) {
            return <div className="no-comics-message">No has publicado cómics aún</div>;
        }
        // Si no se encuentran cómics en la búsqueda
        if (filteredComics.length === 0) {
            return <div className="no-comics-message">No hay cómics disponibles</div>;
        }

        return (

        <div className="comics-grid">
            {filteredComics.map(comic => (
                <ComicCard
                    key={comic.id}
                    comic={comic}
                    isMyComicsView={true}
                />
            ))}
        </div>
        );
    }, [comicsData, filteredComics]);

    return (

        <>
            {/* Componente Navbar */}
            <Navbar alternativeTitle={"Mis Publicaciones"} /> 

            {/* Botón de 'Volver' */}
            <div className="btn btn-back-container">
                <Button className="btn-back" onClick={() => {
                    resetToAllComics();
                    navigate(-1)
                }}>
                    <span>
                        <img src={backIcon} className="btn-back-img" alt="..." />
                    </span>
                    Volver
                </Button>
            </div>

            <div className="comics-page-container">
                {/* Lista de los cards de cómics */}
                <div className="comics-section">{renderComics}</div>
            </div>
        </>
    )
};

export default MyComics;