import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux"; // Importar el Provider de Redux
import store from "./redux/store"; // Importar tu store de Redux
import ComicsPage from "./components/Comics/ComicsPage";
import Home from "./components/Home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import WishList from "./components/WishList/WishList";
import ComicDetails from "./components/Comics/ComicDetails";
import OffersPage from "./components/Offers/OffersPage";

function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* Proveer el store de Redux */}
      <AuthProvider>
        {" "}
        {/* Proveer el contexto de autenticación */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/comics"
              element={
                <ProtectedRoute>
                  <ComicsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishList />
                </ProtectedRoute>
              }
            />
            <Route path="/details/:comicId" element={<ComicDetails />} />
            <Route
              path="/offers"
              element={
                <ProtectedRoute>
                  <OffersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
