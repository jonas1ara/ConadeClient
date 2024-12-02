// src/componentes/PanelPrincipal.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PanelPrincipal: React.FC = () => {
  const [usuario, setUsuario] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperamos el usuario desde el localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado); // Actualizamos el estado con el nombre del usuario
    } else {
      // Si no hay usuario en el localStorage, redirigimos al login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Panel Principal</h2>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Servicio Postal</h5>
              <p className="card-text">Solicita servicios postales internos.</p>
              <Link to="/servicio-postal" className="btn btn-primary">
                Ir al Servicio Postal
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Servicio de Transporte</h5>
              <p className="card-text">Solicita transporte para tu área.</p>
              <Link to="/servicio-transporte" className="btn btn-primary">
                Ir al Servicio de Transporte
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Uso de Auditorios</h5>
              <p className="card-text">Reserva un auditorio o instalaciones.</p>
              <Link to="/uso-auditorios" className="btn btn-primary">
                Ir al Uso de Auditorios
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Instalación, Reparación y Mantenimiento</h5>
              <p className="card-text">Solicita instalación, reparación o mantenimiento de mobiliario.</p>
              <Link to="/mantenimiento" className="btn btn-primary">
                Ir a Mantenimiento
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelPrincipal;
