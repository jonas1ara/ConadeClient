import React from "react";
import UseTheme from './hooks/UseTheme';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componentesUsuarios/Login";
import RegistroUsuario from "./componentesUsuarios/RegistroUsuario";
import PanelPrincipal from "./componentesServicios/PanelPrincipal";
import Mantenimiento from "./componentesServicios/Mantenimiento";
import ServicioPostal from "./componentesServicios/ServicioPostal";
import ServicioTransporte from "./componentesServicios/ServicioTransporte";
import UsoAuditorios from "./componentesServicios/UsoAuditorios";
import NavBar from "./hooks/NavBar";
import GestionSolicitudes from "./componentesSolicitudes/GestionSolicitudes"; // Importamos la nueva pantalla

function App() {
  UseTheme(); // Aplicar el tema automáticamente

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return localStorage.getItem("usuario") !== null;
  };

  // Obtener el nombre de usuario desde localStorage
  const usuario = localStorage.getItem("usuario") || "";

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Eliminar del localStorage
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para Login */}
        <Route path="/" element={<Login />} />

        {/* Ruta para Registro de Usuario */}
        <Route path="/registro" element={<RegistroUsuario />} />

        {/* Rutas protegidas (requieren que el usuario esté autenticado) */}
        <Route 
          path="/panel-principal" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <PanelPrincipal />
            </>
          ) : <Navigate to="/" />} 
        />
        <Route 
          path="/gestion-solicitudes" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <GestionSolicitudes />
            </>
          ) : <Navigate to="/" />} 
        />
        <Route 
          path="/servicio-postal" 
          element={isAuthenticated() ? (
            <>
              <NavBar />
              <ServicioPostal />
            </>
          ) : <Navigate to="/" />} 
        />
        <Route 
          path="/servicio-transporte" 
          element={isAuthenticated() ? (
            <>
              <NavBar />
              <ServicioTransporte />
            </>
          ) : <Navigate to="/" />} 
        />
        <Route 
          path="/uso-auditorios" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <UsoAuditorios />
            </>
          ) : <Navigate to="/" />} 
        />
        <Route 
          path="/mantenimiento" 
          element={isAuthenticated() ? (
            <>
              <NavBar />
              <Mantenimiento />
            </>
          ) : <Navigate to="/" />} 
        />

        {/* Redirige al login si la ruta no existe */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
