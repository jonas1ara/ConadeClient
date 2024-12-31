import UseTheme from './hooks/UseTheme';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componentesUsuarios/Login";
import RegistroUsuario from "./componentesUsuarios/RegistroUsuario";
import PanelPrincipalUsuarios from "./componentesUsuarios/PanelPrincipalUsuarios";
import Mantenimiento from "./componentesServicios/Mantenimiento";
import ServicioPostal from "./componentesServicios/ServicioPostal";
import ServicioTransporte from "./componentesServicios/ServicioTransporte";
import Eventos from "./componentesServicios/Eventos";
import NavBar from "./hooks/NavBar";
import GestionSolicitudes from "./componentesSolicitudes/GestionSolicitudes"; // Importamos la nueva pantalla
import SolicitudesPorUsuario from "./componentesSolicitudes/SolicitudesPorUsuario";
import AprobarSolicitud from "./componentesSolicitudes/AprobarSolicitud";
import RechazarSolicitud from "./componentesSolicitudes/RechazarSolicitud";
import DetallesSolicitud from './componentesSolicitudes/DetallesSolicitud';
import GestionUsuarios from './componentesUsuarios/GestionUsuarios';
import PanelPrincipalAdministradores from './componentesUsuarios/PanelPrincipalAdministradores';

function App() {
  UseTheme(); // Aplicar el tema automáticamente

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return localStorage.getItem("usuario") !== null;
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
          path="/panel-principal-usuarios" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <PanelPrincipalUsuarios />
            </>
          ) : <Navigate to="/" />} 
        />

<Route 
          path="/panel-principal-administradores" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <PanelPrincipalAdministradores/>
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
          path="/solicitudes-por-usuario" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <SolicitudesPorUsuario />
            </>
          ) : <Navigate to="/" />}
        />

        <Route 
          path="/aprobar-solicitud/:id" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <AprobarSolicitud />
            </>
          ) : <Navigate to="/" />}

        />

        <Route 
          path="/rechazar-solicitud/:id" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <RechazarSolicitud />
            </>
          ) : <Navigate to="/" />}

        />

        <Route 
          path="/detalles-solicitud/:id" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <DetallesSolicitud />
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
          path="/eventos" 
          element={isAuthenticated() ? (
            <>
              <NavBar/>
              <Eventos />
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

<Route 
          path="/gestion-usuarios" 
          element={isAuthenticated() ? (
            <>
              <NavBar />
              <GestionUsuarios />
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
