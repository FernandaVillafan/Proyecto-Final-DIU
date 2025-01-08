import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";

// Importamos el archivo CSS
import "./ComicsPage.css";

// Importamos el contexto
import { useComics } from '../../context/ComicsContext';

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import ComicCard from "./ComicCard";
import { setSearchTerm } from '../../redux/searchSlice';

// Objeto para las categorías
const CATEGORIES = [
  { value: "all", label: "Todas las categorías" },
  { value: "independiente", label: "Independiente" },
  { value: "supercomic", label: "SuperComic" },
  { value: "eclipse", label: "Eclipse Entertainment" },
  { value: "manga", label: "Manga" },
];

// Objeto para las opciones de ordenamiento
const SORT_OPTIONS = [
  { value: "none", label: "Sin ordenar" },
  { value: "asc", label: "A-Z" },
  { value: "desc", label: "Z-A" },
];

const ComicsPage = () => {

  // Obtenemos los datos y funciones del contexto
  const { comicsData, fetchInitialData } = useComics();
  
  // Estados para manejar los filtros y la barra de búsqueda
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.search.searchTerm);

  // Reset de categoría cuando hay una búsqueda
  useEffect(() => {
    if (searchTerm) {
      setSelectedCategory("all");
    }
  }, [searchTerm]);

  // Manejador del cambio de categoría
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    // Limpiamos la búsqueda cuando se selecciona una categoría
    if (newCategory !== "all") {
      dispatch(setSearchTerm(""));
    }
  };

  // Manejador del cambio de ordenamiento
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Función para cargar los datos de los cómics
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Función para obtener los cómics filtrados por categoría o por la barra de búsqueda
  const filteredComics = useMemo(() => {
    let filtered = comicsData;
    // Aplicamos el filtro de categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        comic => comic.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    // Aplicamos la búsqueda
    if (searchTerm) {
      filtered = comicsData.filter(
        comic => comic.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Aplicamos el ordenamiento
    if (sortOrder !== "none") {
      filtered = [...filtered].sort((a, b) => {
        const titleA = (a.title || "").toLowerCase();
        const titleB = (b.title || "").toLowerCase();
        if (sortOrder === "asc") {
          return titleA.localeCompare(titleB);
        } else {
          return titleB.localeCompare(titleA);
        }
      });
    }

    return filtered;
  }, [comicsData, selectedCategory, searchTerm, sortOrder]);

  // Función para renderizar los cards de cómics
  const renderComics = useMemo(() => {
    if (filteredComics.length === 0) {
      return <div className="no-comics-message">No hay cómics disponibles</div>;
    }

    return (

      <div className="comics-grid">
        {filteredComics.map(comic => (
          <ComicCard
            key={comic.id}
            comic={comic}
          />
        ))}
      </div>
    );
  }, [filteredComics]);

  return (
    
    <div>
      {/* Componente Navbar */}
      <Navbar />
      
      <div className="comics-page-container">
        <div className="category-select-container">
          <Form className="category-form">
            {/* Select para el ordenamiento alfabético */}
            <Form.Select
              value={sortOrder}
              onChange={handleSortChange}
              className="category-select"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>

            {/* Select de las categorías */}
            <Form.Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Form.Select>
          </Form>
        </div>

        {/* Lista de los cards de cómics */}
        <div className="comics-section">{renderComics}</div>
      </div>
    </div>
  );
};

export default ComicsPage;