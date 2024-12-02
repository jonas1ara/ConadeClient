import React, { useState, useEffect } from "react";

const GestionSolicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const response = await fetch("https://localhost:7094/api/Solicitud/Listar");
        if (!response.ok) {
          throw new Error("Error al obtener las solicitudes.");
        }
        const data = await response.json();
        if (data.solicitudes && Array.isArray(data.solicitudes)) {
          setSolicitudes(data.solicitudes);
        } else {
          throw new Error("La respuesta de la API no contiene un array de solicitudes.");
        }
      } catch (error: any) {
        console.error("Error al cargar las solicitudes:", error);
        setError(error.message || "Hubo un problema al cargar las solicitudes.");
      }
    };

    obtenerSolicitudes();
  }, []);

  const manejarAprobar = async (id: number) => {
    if (window.confirm("¿Estás seguro de aprobar esta solicitud?")) {
      try {
        const response = await fetch(`https://localhost:7094/api/Solicitudes/${id}/aprobar`, {
          method: "PATCH",
        });
        if (!response.ok) {
          throw new Error("Error al aprobar la solicitud.");
        }
        setSolicitudes((prev) =>
          prev.map((solicitud) =>
            solicitud.id === id ? { ...solicitud, estado: "Aprobada" } : solicitud
          )
        );
      } catch (error: any) {
        console.error("Error al aprobar la solicitud:", error);
        setError(error.message || "Hubo un problema al aprobar la solicitud.");
      }
    }
  };

  const manejarRechazar = async (id: number) => {
    if (window.confirm("¿Estás seguro de rechazar esta solicitud?")) {
      try {
        const response = await fetch(`https://localhost:7094/api/Solicitudes/${id}/rechazar`, {
          method: "PATCH",
        });
        if (!response.ok) {
          throw new Error("Error al rechazar la solicitud.");
        }
        setSolicitudes((prev) =>
          prev.map((solicitud) =>
            solicitud.id === id ? { ...solicitud, estado: "Rechazada" } : solicitud
          )
        );
      } catch (error: any) {
        console.error("Error al rechazar la solicitud:", error);
        setError(error.message || "Hubo un problema al rechazar la solicitud.");
      }
    }
  };

  const manejarEliminar = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta solicitud?")) {
      try {
        const response = await fetch(`https://localhost:7094/api/Solicitudes/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Error al eliminar la solicitud.");
        }
        setSolicitudes((prev) => prev.filter((solicitud) => solicitud.id !== id));
      } catch (error: any) {
        console.error("Error al eliminar la solicitud:", error);
        setError(error.message || "Hubo un problema al eliminar la solicitud.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gestión de Solicitudes</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Serie</th>
            <th>Fecha de Solicitud</th>
            <th>Área Solicitante</th>
            <th>Usuario Solicitante</th>
            <th>Tipo de Solicitud</th>
            <th>Estado</th>
            <th>ID del Catálogo</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(solicitudes) && solicitudes.length > 0 ? (
            solicitudes.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{solicitud.id}</td>
                <td>{solicitud.numeroDeSerie}</td>
                <td>{solicitud.fechaSolicitud}</td>
                <td>{solicitud.areaSolicitante}</td>
                <td>{solicitud.usuarioSolicitante}</td>
                <td>{solicitud.tipoSolicitud}</td>
                <td>{solicitud.estado}</td>
                <td>{solicitud.catalogoId}</td>
                <td>{solicitud.observaciones}</td>
                <td>
                  <div className="d-flex flex-wrap justify-content-start">
                    <button
                      className="btn btn-success me-2 mb-2"
                      onClick={() => manejarAprobar(solicitud.id)}
                    >
                      Aprobar
                    </button>
                    <button
                      className="btn btn-warning me-2 mb-2"
                      onClick={() => manejarRechazar(solicitud.id)}
                    >
                      Rechazar
                    </button>
                    <button
                      className="btn btn-danger mb-2"
                      onClick={() => manejarEliminar(solicitud.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center">
                {error ? "No se pudieron cargar las solicitudes." : "No hay solicitudes disponibles."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GestionSolicitudes;
