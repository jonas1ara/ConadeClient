import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const [usuario, setUsuario] = useState<string | null>(null); // Estado dinámico para el usuario
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener usuario desde localStorage al montar el componente
    const usuarioActual = localStorage.getItem("usuario");
    setUsuario(usuarioActual);
  }, []); // Solo se ejecuta al montar el componente

  const manejarCerrarSesion = () => {
    localStorage.removeItem("usuario"); // Eliminar datos del localStorage
    localStorage.removeItem("rol"); // Eliminar el rol del localStorage
    navigate("/login"); // Redirigir al login
  };

  const manejarNavegacion = () => {
    const rol = localStorage.getItem("rol");
    if (rol === "Usuario") {
      navigate("/panel-principal");
    } else if (rol === "Admin") {
      navigate("/gestion-solicitudes");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button
          className="navbar-brand btn btn-link"
          onClick={manejarNavegacion}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <strong>CONADE</strong>
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="navbar-text me-3">
                {usuario ? `Bienvenido, ${usuario}` : "Bienvenido"}
              </span>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger" onClick={manejarCerrarSesion}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
