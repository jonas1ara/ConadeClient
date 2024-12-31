import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PanelPrincipalUsuarios: React.FC = () => {
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
              <h5 className="card-title">Servicio Postal</h5>
              <p className="card-text">Solicita servicios postales internos.</p>
              <Link to="/servicio-postal" className="btn btn-primary">
                Ir al Servicio Postal
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4 d-flex align-items-stretch">
          <div className="card w-100">
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
        <div className="col-md-6 mb-4 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body text-center">
              <h5 className="card-title">Eventos</h5>
              <p className="card-text">Solicita mobiliario o inmobiliario para eventos.</p>
              <Link to="/eventos" className="btn btn-primary">
                Ir a Eventos
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body text-center">
              <h5 className="card-title">Mantenimiento</h5>
              <p className="card-text">Solicita instalación, reparación o mantenimiento de mobiliario.</p>
              <Link to="/mantenimiento" className="btn btn-primary">
                Ir a Mantenimiento
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body text-center">
              <h5 className="card-title">Abastecimiento de Combustible</h5>
              <p className="card-text">Solicita abastecimiento de combustible para vehículos.</p>
              <Link to="/abastecimiento-combustible" className="btn btn-primary">
               Ir a Abastecimiento de Combustible
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelPrincipalUsuarios;
