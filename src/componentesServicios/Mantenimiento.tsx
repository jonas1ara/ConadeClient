import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudServicioMantenimiento: React.FC = () => {
  const navigate = useNavigate();

  const [numeroDeSerie, setNumeroDeSerie] = useState<string>("");
  const [fechaSolicitud, setFechaSolicitud] = useState<string>(new Date().toISOString().split("T")[0]);
  const [areaSolicitante, setAreaSolicitante] = useState<string>("");
  const [usuarioSolicitanteID, setUsuarioSolicitanteID] = useState<number | null>(null);
  const [tipoSolicitud, setTipoSolicitud] = useState<string>("Mantenimiento");
  const [tipoServicio, setTipoServicio] = useState<string>("");
  const [descripcionServicio, setDescripcionServicio] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
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
      case "tipoServicio":
        setTipoServicio(value);
        break;
      case "descripcionServicio":
        setDescripcionServicio(value);
        break;
      case "fechaInicio":
        setFechaInicio(value);
        break;
      case "fechaFin":
        setFechaFin(value);
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

    if (!areaSolicitante || !fechaInicio) {
      setError("El área solicitante y la fecha de inicio son obligatorias.");
      return;
    }

    try {
      const url = `https://localhost:7094/api/Mantenimiento/Crear?numeroDeSerie=${encodeURIComponent(numeroDeSerie)}&areaSolicitante=${encodeURIComponent(areaSolicitante)}&usuarioSolicitante=${encodeURIComponent(usuarioSolicitanteID)}&tipoSolicitud=${encodeURIComponent(tipoSolicitud)}&tipoServicio=${encodeURIComponent(tipoServicio)}&catalogoId=${encodeURIComponent("1")}&descripcionServicio=${encodeURIComponent(descripcionServicio)}&fechaInicio=${encodeURIComponent(fechaInicio)}&fechaEntrega=${encodeURIComponent(fechaFin)}&estado=${encodeURIComponent(estado)}`;

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
      setTipoSolicitud("");
      setTipoServicio("");
      setDescripcionServicio("");
      setFechaInicio("");
      setFechaFin("");

      // Esperar 2 segundos y luego navegar a la página principal
      setTimeout(() => {
        navigate("/panel-principal");
      }, 2000); // 2000 milisegundos (2 segundos)

    } catch (error: any) {
      setError(error.message || "Error al enviar la solicitud.");
    }
  };

  const manejarCancelar = () => {
    navigate("/panel-principal");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Solicitud de Mantenimiento</h2>

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
            value="Mantenimiento"
            disabled
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tipoDeServicio" className="form-label">
            Tipo de Servicio
          </label>
          <select
            className="form-control"
            id="tipoDeServicio"
            name="tipoServicio"
            value={tipoServicio}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un tipo de servicio</option>
            <option value="Preventivo">Preventivo</option>
            <option value="Correctivo">Correctivo</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="fechaInicio" className="form-label">
            Fecha de Inicio
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaInicio"
            name="fechaInicio"
            value={fechaInicio}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fechaFin" className="form-label">
            Fecha de Finalización
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaFin"
            name="fechaFin"
            value={fechaFin}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcionServicio" className="form-label">
            Descripción del Servicio
          </label>
          <textarea
            className="form-control"
            id="descripcionServicio"
            name="descripcionServicio"
            value={descripcionServicio}
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

export default SolicitudServicioMantenimiento;
