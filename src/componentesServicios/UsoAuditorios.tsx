import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

interface CatalogoArea {
  id: number;
  nombre: string;
}

const SolicitudUsoInmobiliario: React.FC = () => {
  const navigate = useNavigate(); // Usamos useNavigate para la redirección

  const [formData, setFormData] = useState({
    sala: "",
    catalogoID: "",
    fechaInicio: "",
    fechaFin: "",
    horarioInicio: "",
    horarioFin: "",
    estado: "Solicitada",
    observaciones: "",
  });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const catalogoAreas: CatalogoArea[] = [
    { id: 1, nombre: "Área 1" },
    { id: 2, nombre: "Área 2" },
    { id: 3, nombre: "Área 3" },
  ];

  const salasDisponibles = ["Sala A", "Sala B", "Auditorio Principal", "Sala de Juntas"];

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "catalogoID" ? (value === "" ? "" : parseInt(value)) : value,
    }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const { sala, catalogoID, fechaInicio, horarioInicio, horarioFin } = formData;

    if (!sala || !catalogoID || !fechaInicio || !horarioInicio || !horarioFin) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7094/api/UsoInmobiliario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, fechaFin: formData.fechaFin || null }),
      });

      if (!response.ok) {
        throw new Error("Hubo un error al crear la solicitud.");
      }

      setSuccessMessage("Solicitud enviada exitosamente.");
      setFormData({
        sala: "",
        catalogoID: "",
        fechaInicio: "",
        fechaFin: "",
        horarioInicio: "",
        horarioFin: "",
        estado: "Solicitada",
        observaciones: "",
      });
    } catch (error: any) {
      setError(error.message || "Error al enviar la solicitud.");
    }
  };

  const manejarCancelar = () => {
    navigate("/panel-principal"); // Redirige a la ruta del panel principal
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Solicitud de Uso de Auditorios</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

      <form onSubmit={manejarEnvio}>
        <div className="mb-3">
          <label htmlFor="sala" className="form-label">
            Sala
          </label>
          <select
            className="form-control"
            id="sala"
            name="sala"
            value={formData.sala}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione una sala</option>
            {salasDisponibles.map((sala, index) => (
              <option key={index} value={sala}>
                {sala}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="catalogoID" className="form-label">
            Área
          </label>
          <select
            className="form-control"
            id="catalogoID"
            name="catalogoID"
            value={formData.catalogoID}
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
          <label htmlFor="fechaInicio" className="form-label">
            Fecha de Inicio
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio}
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
            value={formData.fechaFin}
            onChange={manejarCambio}
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
            value={formData.horarioInicio}
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
            value={formData.horarioFin}
            onChange={manejarCambio}
            required
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
            value={formData.estado}
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
            value={formData.observaciones}
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

export default SolicitudUsoInmobiliario;
