import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Importamos el archivo CSS
import "./UserPage.css";

// Importamos el contexto
import { useUser } from "../../context/UserContext";

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import EditDataButton from './EditDataButton';
import EditImageButton from './EditImageButton';

// Importamos los íconos (imágenes png)
import editIcon from "../../images/edit.png";
import backIcon from "../../images/back.png";
import defaultImage from "../../images/default-user.jpg";

const UserPage = () => {

    const navigate = useNavigate(); // Hook para manejar la navegación
    
    // Obtenemos los datos del usuario del contexto
    const { userData } = useUser();

    return (
        
        <>
            {/* Componente Navbar */}
            <Navbar 
                alternativeIcon={editIcon} 
                alternativeTitle={"Editar mi Perfil"}
                isEditUserView={true}
            />

            {/* Botón de 'Volver' */}
            <div className="btn btn-back-container">
                <Button className="btn-back" onClick={() => navigate(-1)}>
                    <span>
                        <img src={backIcon} className="btn-back-img" alt="..." />
                    </span>
                    Volver
                </Button>
            </div>

            <div className="update-section">
                <div className="row">
                    {/* Imagen de perfil */}
                    <div className="col-md-5 user-image-div">
                        <div className="d-inline-block">
                            <img 
                                src={userData?.image ? `${process.env.REACT_APP_API_URL}/${userData.image}` : defaultImage}
                                alt="..."
                                className={`rounded-circle img-fluid ${userData?.image ? 'user-image' : 'user-icon'}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultImage;
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md"></div>

                    {/* Datos del usuario */}
                    <div className="col-md-6">
                        <div className="user-info">
                            {[
                                { label: 'Nombre(s):', value: userData?.name },
                                { label: 'Apellido(s):', value: userData?.last_name },
                                { label: 'Correo:', value: userData?.email },
                                { label: 'Contraseña:', value: '********' },
                                { label: 'Teléfono:', value: userData?.phone || "No aplica" },
                                { label: 'Username:', value: userData?.username },
                            ].map(({ label, value }) => (
                                <div key={label} className="info-row d-flex mb-3">
                                    <div className="info-label">{label}</div>
                                    <div className="info-value">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-5">
                        {/* Botón para editar la imagen de perfil */}
                        <div className="buttons-container">
                            <EditImageButton />
                        </div>
                    </div>

                    <div className="col-md-1"></div>

                    <div className="col-md-6">
                        {/* Botón para editar los datos */}
                        <div className="buttons-container">
                            <EditDataButton />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserPage;