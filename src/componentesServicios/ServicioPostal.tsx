import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudServicioPostal: React.FC = () => {
  const navigate = useNavigate();

  const [numeroDeSolicitud, setNumeroDeSolicitud] = useState<string>("");
  const [fechaSolicitud, setFechaSolicitud] = useState<string>(new Date().toISOString().split("T")[0]);
  const [areaSolicitante, setAreaSolicitante] = useState<string>("");
  const [usuarioSolicitante, setUsuarioSolicitante] = useState<string>("");
  const [usuarioSolicitanteID, setUsuarioSolicitanteID] = useState<number | null>(null);
  const [tipoSolicitud, setTipoSolicitud] = useState<string>("Servicio Postal"); // Añadido
  const [tipoServicio, setTipoServicio] = useState<string>("");
  const [descripcionServicio, setDescripcionServicio] = useState<string>("");
  const [estado, setEstado] = useState<string>("Solicitada");
  const [observaciones, setObservaciones] = useState<string>("");
  const [fechaEnvio, setFechaEnvio] = useState<string>("");
  const [fechaRecepcionMaxima, setFechaRecepcionMaxima] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [areasCatalogo, setAreasCatalogo] = useState<any[]>([]);

  console.log(usuarioSolicitante);
  console.log(usuarioSolicitanteID);
  console.log(estado);

  setUsuarioSolicitante; // Añadido
  setFechaSolicitud; // Añadido

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
      case "descripcionServicio":
        setDescripcionServicio(value);
        break;
      case "estado":
        setEstado(value);
        break;
      case "observaciones":
        setObservaciones(value);
        break;
      case "fechaEnvio":
        setFechaEnvio(value);
        break;
      case "fechaRecepcionMaxima":
        setFechaRecepcionMaxima(value);
        break;
      case "tipoSolicitud": // Manejo de tipoSolicitud
        setTipoSolicitud(value);
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
    if (!areaSolicitante || !descripcionServicio || !fechaEnvio || !fechaRecepcionMaxima) {
      setError("El área solicitante, la descripción del servicio, la fecha de envío y la fecha de recepción son obligatorios.");
      return;
    }

    try {
      const url = `https://localhost:7094/api/ServicioPostal/Crear?numeroDeSerie=${encodeURIComponent(numeroDeSolicitud)}&areaSolicitante=${encodeURIComponent(areaSolicitante)}&usuarioSolicitante=${usuarioSolicitanteID}&tipoSolicitud=${encodeURIComponent(tipoSolicitud)}&tipoDeServicio=${encodeURIComponent(tipoServicio)}&catalogoId=${encodeURIComponent("1")}&fechaEnvio=${encodeURIComponent(fechaEnvio)}&fechaRecepcionMaxima=${encodeURIComponent(fechaRecepcionMaxima)}&descripcionServicio=${encodeURIComponent(descripcionServicio)}&estado=${encodeURIComponent("Solicitada")}&observaciones=${encodeURIComponent(observaciones)}`;

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
      setDescripcionServicio("");
      setFechaEnvio("");
      setFechaRecepcionMaxima("");

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
            value="Servicio Postal"
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

        <div className="mb-3">
          <label htmlFor="fechaEnvio" className="form-label">
            Fecha de Envío
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaEnvio"
            name="fechaEnvio"
            value={fechaEnvio}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fechaRecepcionMaxima" className="form-label">
            Fecha de Recepción Máxima
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaRecepcionMaxima"
            name="fechaRecepcionMaxima"
            value={fechaRecepcionMaxima}
            onChange={manejarCambio}
            required
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

export default SolicitudServicioPostal;
