import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SolicitudMantenimiento: React.FC = () => {
  const navigate = useNavigate();

  const [catalogoID, setCatalogoID] = useState<number | "">("");
  const [tipoMantenimiento, setTipoMantenimiento] = useState<string>("Preventivo");
  const [descripcionServicio, setDescripcionServicio] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaEntrega, setFechaEntrega] = useState<string>("");
  const [estado, setEstado] = useState<string>("No iniciado");
  const [observaciones, setObservaciones] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const catalogoAreas = [
    { id: 1, nombre: "Área 1" },
    { id: 2, nombre: "Área 2" },
    { id: 3, nombre: "Área 3" },
  ]; // Simulación de datos de CatArea.

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "catalogoID":
        setCatalogoID(value === "" ? "" : parseInt(value, 10));
        break;
      case "tipoMantenimiento":
        setTipoMantenimiento(value);
        break;
      case "descripcionServicio":
        setDescripcionServicio(value);
        break;
      case "fechaInicio":
        setFechaInicio(value);
        break;
      case "fechaEntrega":
        setFechaEntrega(value);
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

    if (!catalogoID || !tipoMantenimiento || !descripcionServicio || !fechaInicio) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7094/api/Mantenimiento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          catalogoID,
          tipoMantenimiento,
          descripcionServicio,
          fechaInicio,
          fechaEntrega: fechaEntrega || null,
          estado,
          observaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("Hubo un error al crear la solicitud.");
      }

      setSuccessMessage("Solicitud enviada exitosamente.");
      setCatalogoID("");
      setTipoMantenimiento("Preventivo");
      setDescripcionServicio("");
      setFechaInicio("");
      setFechaEntrega("");
      setEstado("No iniciado");
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
      <h2 className="text-center mb-4">Solicitud de Mantenimiento</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

      <form onSubmit={manejarEnvio}>
        <div className="mb-3">
          <label htmlFor="catalogoID" className="form-label">
            Área
          </label>
          <select
            className="form-control"
            id="catalogoID"
            name="catalogoID"
            value={catalogoID}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un área</option>
            {catalogoAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="tipoMantenimiento" className="form-label">
            Tipo de Mantenimiento
          </label>
          <select
            className="form-control"
            id="tipoMantenimiento"
            name="tipoMantenimiento"
            value={tipoMantenimiento}
            onChange={manejarCambio}
            required
          >
            <option value="Preventivo">Preventivo</option>
            <option value="Correctivo">Correctivo</option>
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
          <label htmlFor="fechaInicio" className="form-label">
            Fecha de Inicio
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="fechaInicio"
            name="fechaInicio"
            value={fechaInicio}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fechaEntrega" className="form-label">
            Fecha de Entrega (opcional)
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="fechaEntrega"
            name="fechaEntrega"
            value={fechaEntrega}
            onChange={manejarCambio}
          />
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
            <option value="No iniciado">No iniciado</option>
            <option value="En proceso">En proceso</option>
            <option value="Entregado">Entregado</option>
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

export default SolicitudMantenimiento;
