import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudServicioPostal: React.FC = () => {
  const navigate = useNavigate();

  const [numeroDeSolicitud, setNumeroDeSolicitud] = useState<string>("");
  const [fechaSolicitud, setFechaSolicitud] = useState<string>(new Date().toISOString().split("T")[0]);
  const [areaSolicitante, setAreaSolicitante] = useState<string>("");
  const [usuarioSolicitante, setUsuarioSolicitante] = useState<string>("");
  const [tipoServicio, setTipoServicio] = useState<string>("Llevar");
  const [descripcionServicio, setDescripcionServicio] = useState<string>("");
  const [estado, setEstado] = useState<string>("Solicitada");
  const [observaciones, setObservaciones] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const areasCatalogo = ["Área 1", "Área 2", "Área 3"]; // Simulación de datos del catálogo de áreas

  // Recuperar usuario desde localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuarioSolicitante(usuarioGuardado); // Usuario logueado
    }
  }, []);

  // Generar número de solicitud (simulación)
  useEffect(() => {
    const numeroSerie = Math.floor(Math.random() * 10000); // Número aleatorio para la solicitud
    setNumeroDeSolicitud(numeroSerie.toString());
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "areaSolicitante":
        setAreaSolicitante(value);
        break;
      case "tipoServicio":
        setTipoServicio(value);
        break;
      case "descripcionServicio":
        setDescripcionServicio(value);
        break;
      case "estado":
        setEstado(value);
        break;
      case "observaciones":
        setObservaciones(value);
        break;
      default:
        break;
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!areaSolicitante || !descripcionServicio) {
      setError("El área solicitante y la descripción del servicio son obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7094/api/Solicitudes/ServicioPostal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numeroDeSolicitud,
          fechaSolicitud,
          areaSolicitante,
          usuarioSolicitante,
          tipoServicio,
          descripcionServicio,
          estado,
          observaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("Hubo un error al crear la solicitud.");
      }

      setSuccessMessage("Solicitud enviada exitosamente.");
      setNumeroDeSolicitud("");
      setAreaSolicitante("");
      setDescripcionServicio("");
      setObservaciones("");
    } catch (error: any) {
      setError(error.message || "Error al enviar la solicitud.");
    }
  };

  const manejarCancelar = () => {
    navigate("/panel-principal");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Solicitud de Servicio Postal</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

      <form onSubmit={manejarEnvio}>
        <div className="mb-3">
          <label htmlFor="numeroDeSolicitud" className="form-label">
            Número de Solicitud
          </label>
          <input
            type="text"
            className="form-control"
            id="numeroDeSolicitud"
            name="numeroDeSolicitud"
            value={numeroDeSolicitud}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fechaSolicitud" className="form-label">
            Fecha de Solicitud
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaSolicitud"
            name="fechaSolicitud"
            value={fechaSolicitud}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="areaSolicitante" className="form-label">
            Área Solicitante
          </label>
          <select
            className="form-control"
            id="areaSolicitante"
            name="areaSolicitante"
            value={areaSolicitante}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un área</option>
            {areasCatalogo.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="usuarioSolicitante" className="form-label">
            Usuario Solicitante
          </label>
          <input
            type="text"
            className="form-control"
            id="usuarioSolicitante"
            name="usuarioSolicitante"
            value={usuarioSolicitante}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tipoServicio" className="form-label">
            Tipo de Servicio
          </label>
          <select
            className="form-control"
            id="tipoServicio"
            name="tipoServicio"
            value={tipoServicio}
            onChange={manejarCambio}
          >
            <option value="Llevar">Llevar</option>
            <option value="Recoger">Recoger</option>
            <option value="LlevarYRecoger">Llevar y Recoger</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="descripcionServicio" className="form-label">
            Descripción del Servicio
          </label>
          <textarea
            className="form-control"
            id="descripcionServicio"
            name="descripcionServicio"
            rows={3}
            value={descripcionServicio}
            onChange={manejarCambio}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="estado" className="form-label">
            Estado
          </label>
          <select
            className="form-control"
            id="estado"
            name="estado"
            value={estado}
            onChange={manejarCambio}
          >
            <option value="Solicitada">Solicitada</option>
            <option value="Atendida">Atendida</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="observaciones" className="form-label">
            Observaciones
          </label>
          <textarea
            className="form-control"
            id="observaciones"
            name="observaciones"
            rows={3}
            value={observaciones}
            onChange={manejarCambio}
          ></textarea>
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={manejarCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudServicioPostal;
