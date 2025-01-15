import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudCombustible: React.FC = () => {
  const navigate = useNavigate();

  const [numeroDeSerie, setNumeroDeSerie] = useState<string>("");
  const [fechaSolicitud, setFechaSolicitud] = useState<string>(new Date().toISOString().split("T")[0]);
  const [areaSolicitante, setAreaSolicitante] = useState<string>("");
  const [usuarioSolicitanteID, setUsuarioSolicitanteID] = useState<number | null>(null);
  const [tipoSolicitud, setTipoSolicitud] = useState<string>("Combustible");
  const [tipoCombustible, setTipoCombustible] = useState<string>("");
  const [cantidadSolicitada, setCantidadSolicitada] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>("");
  const [estado, setEstado] = useState<string>("Solicitada");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [areasCatalogo, setAreasCatalogo] = useState<any[]>([]);

  // Recuperar usuario desde localStorage
  useEffect(() => {
    const usuarioIdGuardado = localStorage.getItem("idUsuario");
    if (usuarioIdGuardado) {
      setUsuarioSolicitanteID(Number(usuarioIdGuardado));
    } else {
      setError("Usuario no encontrado. Por favor, inicie sesión.");
      console.error("usuarioId no encontrado en localStorage");
    }
  }, []);

  // Generar número de solicitud (simulación)
  useEffect(() => {
    const numeroSerie = Math.floor(Math.random() * 10000); // Número aleatorio para la solicitud
    setNumeroDeSerie(numeroSerie.toString());
  }, []);

  // Cargar áreas disponibles desde la API
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch("https://localhost:7094/api/CatArea/Listar");
        if (!response.ok) {
          throw new Error("Error al obtener áreas.");
        }
        const data = await response.json();

        if (Array.isArray(data.catAreas)) {
          setAreasCatalogo(data.catAreas);
        } else {
          setError("Los datos de áreas no son válidos.");
        }
      } catch (error) {
        setError("No se pudieron cargar las áreas.");
      }
    };
    fetchAreas();
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "areaSolicitante":
        setAreaSolicitante(value);
        break;
      case "tipoCombustible":
        setTipoCombustible(value);
        break;
      case "cantidadSolicitada":
        setCantidadSolicitada(Number(value));
        break;
      case "descripcion":
        setDescripcion(value);
        break;
      case "estado":
        setEstado(value);
        break;
      default:
        break;
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!usuarioSolicitanteID) {
      setError("El ID del usuario solicitante es obligatorio.");
      return;
    }

    if (!areaSolicitante || cantidadSolicitada <= 0) {
      setError("El área solicitante y la cantidad solicitada son obligatorias.");
      return;
    }

    try {
      const url = `https://localhost:7094/api/Combustible/Crear?numeroDeSerie=${encodeURIComponent(numeroDeSerie)}&areaSolicitante=${encodeURIComponent(areaSolicitante)}&usuarioSolicitante=${encodeURIComponent(usuarioSolicitanteID)}&tipoSolicitud=${encodeURIComponent(tipoSolicitud)}&tipoCombustible=${encodeURIComponent(tipoCombustible)}&cantidadSolicitada=${encodeURIComponent(cantidadSolicitada)}&descripcion=${encodeURIComponent(descripcion)}&estado=${encodeURIComponent(estado)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al crear la solicitud:", errorData);

        // Mostrar los mensajes de error específicos
        if (errorData.mensaje) {
          setError(errorData.mensaje);
        } else {
          setError("Hubo un error al crear la solicitud.");
        }
        return;
      }

      setSuccessMessage("Solicitud enviada exitosamente.");
      setNumeroDeSerie("");
      setFechaSolicitud("");
      setAreaSolicitante("");
      setTipoCombustible("");
      setCantidadSolicitada(0);
      setDescripcion("");
      setEstado("Solicitada");

      navigate("/panel-principal");

    } catch (error: any) {
      setError(error.message || "Error al enviar la solicitud.");
    }
  };

  const manejarCancelar = () => {
    navigate("/panel-principal");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Solicitud de Combustible</h2>

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
            value={numeroDeSerie}
            disabled
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
            disabled
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
            {Array.isArray(areasCatalogo) && areasCatalogo.map((area) => (
              <option key={area.idArea} value={area.idArea}>
                {area.nombreArea}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="tipoSolicitud" className="form-label">
            Tipo de Solicitud
          </label>
          <input
            type="text"
            className="form-control"
            id="tipoSolicitud"
            name="tipoSolicitud"
            value="Combustible"
            disabled
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tipoCombustible" className="form-label">
            Tipo de Combustible
          </label>
          <select
            className="form-control"
            id="tipoCombustible"
            name="tipoCombustible"
            value={tipoCombustible}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un tipo de combustible</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diésel">Diésel</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="cantidadSolicitada" className="form-label">
            Cantidad Solicitada (Litros)
          </label>
          <input
            type="number"
            className="form-control"
            id="cantidadSolicitada"
            name="cantidadSolicitada"
            value={cantidadSolicitada}
            onChange={manejarCambio}
            required
            min="1"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={descripcion}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="d-flex justify-content-between mb-4">
          <button type="submit" className="btn btn-primary">
            Enviar Solicitud
          </button>
          <button type="button" className="btn btn-secondary" onClick={manejarCancelar}>
            Regresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudCombustible;
