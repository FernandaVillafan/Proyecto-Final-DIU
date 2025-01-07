import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux"; 
import store from "./redux/store"; 

import { AuthProvider } from "./context/AuthContext";
import { ComicsProvider } from "./context/ComicsContext";
import { OffersProvider } from "./context/OffersContext";
import { UserProvider } from "./context/UserContext";

import ComicDetails from "./components/Comics/ComicDetails";
import ComicsPage from "./components/Comics/ComicsPage";
import EditPage from "./components/Comics/EditPage";
import Home from "./components/Home/Home";
import MyComics from "./components/Comics/MyComics";
import OffersPage from "./components/Offers/OffersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserPage from './components/User/UserPage';
import WishList from "./components/WishList/WishList";

function App() {

  return (

    <Provider store={store}>
      <AuthProvider>
        <ComicsProvider>
          <UserProvider>
            <OffersProvider>
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
                    path="/my-comics"
                    element={
                      <ProtectedRoute>
                        <MyComics />
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

                  <Route 
                    path="/details/:comicId" 
                    element={
                      <ProtectedRoute>
                        <ComicDetails />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route
                    path="/offers"
                    element={
                      <ProtectedRoute>
                        <OffersPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/update-user"
                    element={
                      <ProtectedRoute>
                        <UserPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route 
                    path="/update-comic/:comicId"
                    element={
                      <ProtectedRoute>
                        <EditPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </OffersProvider>
          </UserProvider> 
        </ComicsProvider> 
      </AuthProvider>
    </Provider>
  );
}

export default App;