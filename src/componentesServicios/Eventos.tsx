import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudEventos: React.FC = () => {
  const navigate = useNavigate();

  const [numeroDeSolicitud, setNumeroDeSolicitud] = useState<string>("");
  const [fechaSolicitud, setFechaSolicitud] = useState<string>(new Date().toISOString().split("T")[0]);
  const [areaSolicitante, setAreaSolicitante] = useState<string>("");
  const [usuarioSolicitanteID, setUsuarioSolicitanteID] = useState<number | null>(null);
  const [tipoServicio, setTipoServicio] = useState<string>(""); // Nuevo campo para tipo de servicio
  const [tipoSolicitud, setTipoSolicitud] = useState<string>("Eventos"); // Nuevo campo para tipo de servicio
  const [sala, setSala] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [horarioInicio, setHorarioInicio] = useState<string>("");
  const [horarioFin, setHorarioFin] = useState<string>("");
  const [estado, setEstado] = useState<string>("Solicitada");
  const [descripcion, setDescripcion] = useState<string>("");
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
    const numeroSerie = Math.floor(Math.random() * 10000);
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
      case "numeroDeSolicitud":
        setNumeroDeSolicitud(value);
        break;
      case "fechaSolicitud":
        setFechaSolicitud(value);
        break;
      case "usuarioSolicitanteID":
        setUsuarioSolicitanteID(Number(value));
        break;
      case "tipoSolicitud":
        setTipoSolicitud(value);
        break;
      case "areaSolicitante":
        setAreaSolicitante(value);
        break;
      case "tipoServicio":
        setTipoServicio(value);
        if (value !== "Uso de auditorio") {
          setSala("");
        }
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

    if (!areaSolicitante || !fechaInicio || !fechaFin || !horarioInicio || !horarioFin || !tipoServicio) {
      setError("Todos los campos obligatorios deben ser completados.");
      return;
    }

    try {
      const url = `https://localhost:7094/api/Evento/Crear?numeroDeSerie=${encodeURIComponent(numeroDeSolicitud)}&areaSolicitante=${encodeURIComponent(areaSolicitante)}&usuarioSolicitante=${encodeURIComponent(usuarioSolicitanteID)}&tipoSolicitud=${encodeURIComponent(tipoSolicitud)}&tipoServicio=${encodeURIComponent(tipoServicio)}&sala=${encodeURIComponent(sala)}&catalogoId=${encodeURIComponent("1")}&descripcionServicio=${encodeURIComponent(descripcion)}&fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}&horarioInicio=${encodeURIComponent(horarioInicio)}&horarioFin=${encodeURIComponent(horarioFin)}&estado=${encodeURIComponent(estado)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.mensaje || "Error al crear la solicitud.");
        return;
      }

      setSuccessMessage("Solicitud enviada exitosamente.");
      setNumeroDeSolicitud("");
      setFechaSolicitud("");
      setUsuarioSolicitanteID(null);
      setTipoSolicitud("");
      setTipoServicio("");
      setSala("");
      setAreaSolicitante("");
      setFechaInicio("");
      setFechaFin("");
      setHorarioInicio("");
      setHorarioFin("");
      setDescripcion("");

      setTimeout(() => {
        navigate("/panel-principal");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Error al enviar la solicitud.");
    }
  };

  const manejarCancelar = () => {
    navigate("/panel-principal");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Solicitud de Eventos</h2>

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
            value="Eventos"
            disabled
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
            required
          >
            <option value="">Seleccione un tipo de servicio</option>
            <option value="Audio">Audio</option>
            <option value="Grabaciones">Grabaciones</option>
            <option value="Uso de auditorio">Uso de auditorio</option>
          </select>
        </div>

        {tipoServicio === "Uso de auditorio" && (
          <div className="mb-3">
            <label htmlFor="sala" className="form-label">
              Sala
            </label>
            <select
              className="form-control"
              id="sala"
              name="sala"
              value={sala}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccione una sala</option>
              <option value="Auditorio de medicina">Auditorio de medicina</option>
            </select>
          </div>
        )}

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
            Fecha de Fin
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
          <label htmlFor="horarioInicio" className="form-label">
            Horario de Inicio
          </label>
          <input
            type="time"
            className="form-control"
            id="horarioInicio"
            name="horarioInicio"
            value={horarioInicio}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="horarioFin" className="form-label">
            Horario de Fin
          </label>
          <input
            type="time"
            className="form-control"
            id="horarioFin"
            name="horarioFin"
            value={horarioFin}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción del servicio
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
      </form >
    </div >
  );
};

export default SolicitudEventos;

