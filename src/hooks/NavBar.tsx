import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar: React.FC = () => {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const usuarioActual = localStorage.getItem("usuario");
    const rolActual = localStorage.getItem("rol");

    // Configuración inicial del tema basado en preferencias del sistema
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (dark: boolean) => {
      const theme = dark ? "dark" : "light";
      setIsDarkMode(dark);
      document.documentElement.setAttribute("data-bs-theme", theme);
      localStorage.setItem("theme", theme);
    };

    applyTheme(systemTheme.matches);

    // Escuchar cambios en el sistema y actualizar el tema automáticamente
    const handleThemeChange = (e: MediaQueryListEvent) => applyTheme(e.matches);
    systemTheme.addEventListener("change", handleThemeChange);

    setUsuario(usuarioActual);
    setRol(rolActual);

    // Limpieza del event listener al desmontar el componente
    return () => systemTheme.removeEventListener("change", handleThemeChange);
  }, []);

  const manejarCerrarSesion = () => {
    const confirmar = window.confirm("¿Estás seguro de cerrar sesión?");
    if (confirmar) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      navigate("/login");
    }
  };

  const manejarNavegacion = () => {
    if (rol === "Usuario") {
      navigate("/panel-principal-servicios");
    } else if (rol === "Admin") {
      navigate("/panel-principal-solicitudes");
    }
  };

  const manejarVerSolicitudes = () => {
    navigate("/solicitudes-por-usuario");
  };

  const manejarRegresarUsuario = () => {
    navigate("/panel-principal-usuarios");
  };

  const manejarRegresarAdministradores = () => {
    navigate("/panel-principal-administradores");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
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
            {rol === "Usuario" &&
              !["/solicitudes-por-usuario", "/servicio-postal", "/servicio-transporte", "/mantenimiento", "/eventos", "/combustible"].includes(location.pathname) && (
                <li className="nav-item">
                  <button
                    className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} me-1`}
                    onClick={manejarVerSolicitudes}
                  >
                    Solicitudes
                  </button>
                </li>
              )}
            {location.pathname === "/solicitudes-por-usuario" && (
              <li className="nav-item">
                <button
                  className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} me-1`}
                  onClick={manejarRegresarUsuario}
                >
                  Regresar
                </button>
              </li>
            )}

            {rol === "Admin" && location.pathname === "/gestion-solicitudes" && (
              <li className="nav-item">
                <button
                  className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} me-1`}
                  onClick={manejarRegresarAdministradores}
                >
                  Regresar
                </button>
              </li>
            )}

            {rol === "Admin" && location.pathname === "/gestion-usuarios" && (
              <li className="nav-item">
                <button
                  className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-dark"} me-1`}
                  onClick={manejarRegresarAdministradores}
                >
                  Regresar
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
