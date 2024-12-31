import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PanelPrincipalAdministradores: React.FC = () => {
  const [usuario, setUsuario] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperamos el usuario desde el localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado); // Actualizamos el estado con el nombre del usuario
      console.log(usuario);
    } else {
      // Si no hay usuario en el localStorage, redirigimos al login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Panel Principal</h2>

      <div className="row">
        <div className="col-md-6 mb-4 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body text-center">
              <h5 className="card-title">Gestión de Solicitudes</h5>
              <p className="card-text">Aprueba, rechaza y elimina solicitudes de tú área.</p>
              <Link to="/gestion-solicitudes" className="btn btn-primary">
                Ir al Gestión de Solicitudes
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body text-center">
              <h5 className="card-title">Gestión de Usuarios</h5>
              <p className="card-text">Administra, edita y elimina perfiles de Usuarios.</p>
              <Link to="/gestion-usuarios" className="btn btn-primary">
                Ir al Servicio Gestión de Usuarios
              </Link>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default PanelPrincipalAdministradores;
