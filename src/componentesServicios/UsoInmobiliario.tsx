import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudUsoInmobiliario: React.FC = () => {
  const navigate = useNavigate();

  const [numeroDeSolicitud, setNumeroDeSolicitud] = useState<string>("");
  const [fechaSolicitud, setFechaSolicitud] = useState<string>(new Date().toISOString().split("T")[0]);
  const [areaSolicitante, setAreaSolicitante] = useState<string>("");
  const [usuarioSolicitanteID, setUsuarioSolicitanteID] = useState<number | null>(null);
  const [tipoSolicitud, setTipoSolicitud] = useState<string>("Uso Inmobiliario"); 
  const [sala, setSala] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [horarioInicio, setHorarioInicio] = useState<string>("");
  const [horarioFin, setHorarioFin] = useState<string>("");
  const [estado, setEstado] = useState<string>("Solicitada");
  const [observaciones, setObservaciones] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [areasCatalogo, setAreasCatalogo] = useState<any[]>([]);

  // Recuperar usuario desde localStorage
  useEffect(() => {
    const usuarioIdGuardado = localStorage.getItem("idUsuario");
    if (usuarioIdGuardado) {
      setUsuarioSolicitanteID(Number(usuarioIdGuardado)); // Guardar el usuarioId como número
    } else {
      setError("Usuario no encontrado. Por favor, inicie sesión.");
      console.error("usuarioId no encontrado en localStorage");
    }
  }, []);

  // Generar número de solicitud (simulación)
  useEffect(() => {
    const numeroSerie = Math.floor(Math.random() * 10000); // Número aleatorio para la solicitud
    setNumeroDeSolicitud(numeroSerie.toString());
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
      case "tipoSolitud":
        setTipoSolicitud(value);
        break;
      case "sala":
        setSala(value);
        break;
      case "fechaInicio":
        setFechaInicio(value);
        break;
      case "fechaFin":
        setFechaFin(value);
        break;
      case "horarioInicio":
        setHorarioInicio(value);
        break;
      case "horarioFin":
        setHorarioFin(value);
        break;
      case "descripcion":
        setDescripcion(value);
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

    // Validar si usuarioSolicitanteID está presente
    if (!usuarioSolicitanteID) {
      setError("El ID del usuario solicitante es obligatorio.");
      return;
    }

    // Validación de campos obligatorios
    if (!areaSolicitante || !fechaInicio || !fechaFin || !horarioInicio || !horarioFin) {
      setError("El área solicitante, la fecha de uso y hora de inicio y fin son obligatorias.");
      return;
    }

    try {
      const url = `https://localhost:7094/api/UsoInmobiliario/Crear?numeroDeSerie=${encodeURIComponent(numeroDeSolicitud)}&areaSolicitante=${encodeURIComponent(areaSolicitante)}&usuarioSolicitante=${usuarioSolicitanteID}&tipoSolicitud=${encodeURIComponent(tipoSolicitud)}&sala=${encodeURIComponent(sala)}&catalogoId=${encodeURIComponent("1")}&fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}&horarioInicio=${encodeURIComponent(horarioInicio)}&horarioFin=${encodeURIComponent(horarioFin)}&estado=${encodeURIComponent(estado)}&observaciones=${encodeURIComponent(observaciones)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al crear la solicitud:", errorData);
        setError(errorData.title || "Hubo un error al crear la solicitud.");
        if (errorData.errors) {
          setError(JSON.stringify(errorData.errors));
        }
        return;
      }

      setSuccessMessage("Solicitud enviada exitosamente.");
      setNumeroDeSolicitud("");
      setAreaSolicitante("");
      setFechaInicio("");
      setFechaFin("");
      setHorarioInicio("");
      setHorarioFin("");
      setDescripcion("");
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
      <h2 className="text-center mb-4">Solicitud de Uso Inmobiliario</h2>

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
            value="Uso Inmobiliario"
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="sala" className="form-label">
            Sala
          </label>
          <input
            type="text"
            className="form-control"
            id="sala"
            name="sala"
            value={sala}
            onChange={manejarCambio}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fechaInicio" className="form-label">
            Fecha de Inicio
          </label>
          <input
            type="text"
            className="form-control"
            id="fechaInicio"
            name="fechaInicio"
            value={fechaInicio}
            onChange={manejarCambio}
            required
          />
          <small className="form-text text-muted">
            Por favor, ingrese la fecha en formato <strong>YYYY-MM-DD</strong> (por ejemplo, 2024-12-06).
          </small>
        </div>

        <div className="mb-3">
          <label htmlFor="fechaFin" className="form-label">
            Fecha de Fin
          </label>
          <input
            type="text"
            className="form-control"
            id="fechaFin"
            name="fechaFin"
            value={fechaFin}
            onChange={manejarCambio}
            required
          />
          <small className="form-text text-muted">
            Por favor, ingrese la fecha en formato <strong>YYYY-MM-DD</strong> (por ejemplo, 2024-12-06).
          </small>
        </div>

        <div className="mb-3">
          <label htmlFor="horarioInicio" className="form-label">
            Horario de Inicio
          </label>
          <input
            type="text"
            className="form-control"
            id="horarioInicio"
            name="horarioInicio"
            value={horarioInicio}
            onChange={manejarCambio}
            required
          />
          <small className="form-text text-muted">
            Por favor, ingrese la hora en formato <strong>HH:MM</strong> (por ejemplo, 09:30).
          </small>

        </div>

        <div className="mb-3">
          <label htmlFor="horarioFin" className="form-label">
            Horario de Fin
          </label>
          <input
            type="text"
            className="form-control"
            id="horarioFin"
            name="horarioFin"
            value={horarioFin}
            onChange={manejarCambio}
            required
          />
          <small className="form-text text-muted">
            Por favor, ingrese la hora en formato <strong>HH:MM</strong> (por ejemplo, 17:45).
          </small>
        </div>

        <div className="mb-3">
          <label htmlFor="observaciones" className="form-label">
            Observaciones
          </label>
          <textarea
            className="form-control"
            id="observaciones"
            name="observaciones"
            value={observaciones}
            onChange={manejarCambio}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Enviar Solicitud
          </button>
          <button type="button" className="btn btn-secondary" onClick={manejarCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudUsoInmobiliario;
