import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudServicioTransporte: React.FC = () => {
  const navigate = useNavigate();

  const [numeroDeSolicitud, setNumeroDeSolicitud] = useState<string>("");
  const [fechaSolicitud, setFechaSolicitud] = useState<string>(new Date().toISOString().split("T")[0]);
  const [areaSolicitante, setAreaSolicitante] = useState<string>("");
  const [usuarioSolicitanteID, setUsuarioSolicitanteID] = useState<number | null>(null);
  const [tipoSolicitud, setTipoSolicitud] = useState<string>("Servicio Transporte");
  const [tipoServicio, setTipoServicio] = useState<string>("");
  const [origen, setOrigen] = useState<string>("");
  const [destino, setDestino] = useState<string>("");
  const [fechaTransporte, setFechaTransporte] = useState<string>("");
  const [fechaTransporteVuelta, setFechaTransporteVuelta] = useState<string>("");
  const [estado, setEstado] = useState<string>("Solicitada");
  const [observaciones, setObservaciones] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [areasCatalogo, setAreasCatalogo] = useState<any[]>([]);

  setFechaSolicitud;
  setTipoSolicitud;

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
      case "tipoServicio":
        setTipoServicio(value);
        break;
      case "origen":
        setOrigen(value);
        break;
      case "destino":
        setDestino(value);
        break;
      case "fechaTransporte":
        setFechaTransporte(value);
        break;
      case "fechaTransporteVuelta":
        setFechaTransporteVuelta(value);
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
    if (!areaSolicitante || !origen || !destino) {
      setError("El área solicitante, el origen, el destino y la fecha de transporte son obligatorios.");
      return;
    }

    try {
      const url = `https://localhost:7094/api/ServicioTransporte/Crear?numeroDeSerie=${encodeURIComponent(numeroDeSolicitud)}&areaSolicitante=${encodeURIComponent(areaSolicitante)}&usuarioSolicitante=${usuarioSolicitanteID}&tipoSolicitud=${encodeURIComponent(tipoSolicitud)}&tipoDeServicio=${encodeURIComponent(tipoServicio)}&catalogoId=${encodeURIComponent("1")}&fechaTransporte=${encodeURIComponent(fechaTransporte)}&fechaTransporteVuelta=${encodeURIComponent(fechaTransporteVuelta)}&origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}&descripcionServicio=${encodeURIComponent(descripcion)}&estado=${encodeURIComponent(estado)}&observaciones=${encodeURIComponent(observaciones)}`;

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
      setNumeroDeSolicitud("");
      setAreaSolicitante("");
      setOrigen("");
      setDestino("");
      setFechaTransporte("");
      setFechaTransporteVuelta("");
      setDescripcion("");
      setObservaciones("");

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
      <h2 className="text-center mb-4">Solicitud de Servicio de Transporte</h2>

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
            value="Servicio Transporte"
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
            value={tipoServicio} // Asegúrate de que el estado 'tipoServicio' esté correctamente vinculado
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un tipo de servicio</option>
            <option value="Llevar">Llevar</option>
            <option value="Recoger">Recoger</option>
            <option value="Llevar y Recoger">Llevar y Recoger</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="origen" className="form-label">
            Origen
          </label>
          <input
            type="text"
            className="form-control"
            id="origen"
            name="origen"
            value={origen}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="destino" className="form-label">
            Destino
          </label>
          <input
            type="text"
            className="form-control"
            id="destino"
            name="destino"
            value={destino}
            onChange={manejarCambio}
            required
          />
        </div>

        {/* Campo para Fecha de Envío */}
        {(tipoServicio === "Llevar" || tipoServicio === "Llevar y Recoger") && (
          <div className="mb-3">
            <label htmlFor="fechaTransporte" className="form-label">
              Fecha de Transporte
            </label>
            <input
              type="date"
              className="form-control"
              id="fechaTransporte"
              name="fechaTransporte"
              value={fechaTransporte}
              onChange={manejarCambio}
              required
            />
          </div>
        )}

        {/* Campo para Fecha de Recepción Máxima */}
        {(tipoServicio === "Recoger" || tipoServicio === "Llevar y Recoger") && (
          <div className="mb-3">
            <label htmlFor="fechaTransporteVuelta" className="form-label">
              Fecha de Recepción
            </label>
            <input
              type="date"
              className="form-control"
              id="fechaTransporteVuelta"
              name="fechaTransporteVuelta"
              value={fechaTransporteVuelta}
              onChange={manejarCambio}
              required
            />
          </div>
        )}

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
      </form>
    </div>
  );
};

export default SolicitudServicioTransporte;
