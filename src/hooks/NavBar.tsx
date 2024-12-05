import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const [usuario, setUsuario] = useState<string | null>(null); // Estado dinámico para el usuario
  const [rol, setRol] = useState<string | null>(null); // Estado para el rol
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Estado para el modo oscuro
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener usuario y rol desde localStorage al montar el componente
    const usuarioActual = localStorage.getItem("usuario");
    const rolActual = localStorage.getItem("rol");

    // Verificar la preferencia de color del navegador
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    // Aplicar el tema detectado
    setIsDarkMode(theme === "dark");
    document.documentElement.setAttribute('data-bs-theme', theme);

    // Almacenar la preferencia del tema en localStorage para que se recuerde
    localStorage.setItem("theme", theme);

    setUsuario(usuarioActual);
    setRol(rolActual);
  }, []); // Solo se ejecuta al montar el componente

  const manejarCerrarSesion = () => {
    localStorage.removeItem("usuario"); // Eliminar datos del localStorage
    localStorage.removeItem("rol"); // Eliminar el rol del localStorage
    navigate("/login"); // Redirigir al login
  };

  const manejarNavegacion = () => {
    if (rol === "Usuario") {
      navigate("/panel-principal");
    } else if (rol === "Admin") {
      navigate("/gestion-solicitudes");
    }
  };

  const manejarVerSolicitudes = () => {
    navigate("/solicitudes-por-usuario"); // Redirigir a la página de solicitudes
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
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

            {/* Mostrar el botón de "Solicitudes" solo si el rol es "Usuario" */}
            {rol === "Usuario" && (
              <li className="nav-item">
                <button
                  className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'} me-1`}
                  onClick={manejarVerSolicitudes}
                >
                  Solicitudes
                </button>
              </li>
            )}

            <li className="nav-item">
              <button className="btn btn-danger ms-1" onClick={manejarCerrarSesion}>
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
