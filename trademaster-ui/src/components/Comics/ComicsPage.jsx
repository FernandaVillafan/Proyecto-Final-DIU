import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import "./ComicsPage.css";

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import ComicCard from "./ComicCard";

const categories = [
  { value: "all", label: "Todas las categorías" },
  { value: "Independiente", label: "Independiente" },
  { value: "supercomic", label: "SuperComic" },
  { value: "eclipse", label: "Eclipse Entertainment" },
  { value: "manga", label: "Manga" },
];

const ComicsPage = () => {
  // Estados necesarios para cargar los comics
  const [comics, setComics] = useState([]);
  const [wishList, setWishList] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const searchTerm = useSelector((state) => state.search.searchTerm);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      // Primero obtenemos los comics
      const comicsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comics/`
      );

      // Verificamos si hay un token
      const token = localStorage.getItem("access_token");

      if (token) {
        // Si hay token, obtenemos la wishlist
        const wishListResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/comics/wishlist/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const wishListIds = new Set(
          wishListResponse.data.data
            ?.map((item) => item.comic?.id)
            .filter(Boolean)
        );
        setWishList(wishListIds);
      }

      setComics(comicsResponse.data.data || []);
    } catch (error) {
      console.error("Error completo en fetchData: ", error);
      setComics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Llamada inicial
  }, []);

  // Función para obtener los comics filtrados por categoría o por la barra de búsqueda
  const getFilteredComics = () => {
    let filteredComics = comics;

    if (selectedCategory !== "all") {
      filteredComics = filteredComics.filter(
        (comic) => comic.category === selectedCategory
      );
    }

    if (searchTerm) {
      filteredComics = filteredComics.filter((comic) =>
        comic.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredComics;
  };

  const renderComics = () => {
    if (isLoading) {
      return <div className="no-comics-message">Cargando...</div>;
    }

    const filteredComics = getFilteredComics();

    if (filteredComics.length === 0) {
      return <div className="no-comics-message">No hay cómics disponibles</div>;
    }

    return (
      <div className="comics-grid">
        {filteredComics.map((comic) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            isFavorite={wishList.has(comic.id)}
            onWishListUpdate={fetchData}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Navbar onComicPublished={fetchData} />
      <div className="comics-page-container">
        <div className="category-select-container">
          <Form>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Form.Select>
          </Form>
        </div>
        <div className="comics-section">{renderComics()}</div>
      </div>
    </div>
  );
};

export default ComicsPage;
