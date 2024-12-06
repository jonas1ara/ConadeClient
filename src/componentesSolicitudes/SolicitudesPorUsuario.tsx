import React, { useState, useEffect } from 'react';

interface Solicitud {
  id: number;
  numeroDeSerie: string;
  fechaSolicitud: string;
  tipoSolicitud: string;
  estado: string;
  observaciones: string;
}

const SolicitudesPorUsuario: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [error, setError] = useState<string>('');
  const [usuarioSolicitanteID, setUsuarioSolicitanteID] = useState<number | null>(null);

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

  // Función para obtener las solicitudes del usuario
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      if (!usuarioSolicitanteID) return; // No hacer la solicitud si no tenemos el usuarioID

      try {
        // URL del endpoint para obtener solicitudes por usuario
        const url = `https://localhost:7094/api/usuario/SolicitudesPorUsuario/${usuarioSolicitanteID}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al obtener las solicitudes.');
        }

        const data = await response.json();

        if (Array.isArray(data.obj)) {
          setSolicitudes(data.obj);
        } else {
          throw new Error('No se encontraron solicitudes para este usuario.');
        }
      } catch (error: any) {
        console.error('Error al cargar las solicitudes:', error);
        setError(error.message || 'Hubo un problema al cargar las solicitudes.');
      }
    };

    obtenerSolicitudes();
  }, [usuarioSolicitanteID]); // El useEffect depende de `usuarioSolicitanteID`

  // Función para eliminar una solicitud
  const eliminarSolicitud = async (id: number) => {

    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?');

    if (confirmar) {
      try {
        const response = await fetch(`https://localhost:7094/api/usuario/EliminarSolicitud?idSolicitud=${id}&usuarioId=${usuarioSolicitanteID}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la solicitud.');
        }

        // Si la eliminación fue exitosa, actualizar la lista de solicitudes
        setSolicitudes(solicitudes.filter((solicitud) => solicitud.id !== id));
      } catch (error: any) {
        console.error('Error al eliminar la solicitud:', error);
        setError(error.message || 'Hubo un problema al eliminar la solicitud.');
      }

    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Solicitudes del Usuario</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Serie</th>
            <th>Fecha de Solicitud</th>
            <th>Tipo de Solicitud</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Acciones</th> {/* Nueva columna para las acciones */}
          </tr>
        </thead>
        <tbody>
          {solicitudes.length > 0 ? (
            solicitudes.map((solicitud) => (
              <tr key={`${solicitud.id}-${solicitud.numeroDeSerie}`}>
                <td>{solicitud.id}</td>
                <td>{solicitud.numeroDeSerie}</td>
                <td>{solicitud.fechaSolicitud}</td>
                <td>{solicitud.tipoSolicitud}</td>
                <td>{solicitud.estado}</td>
                <td>{solicitud.observaciones}</td>
                <td>
                  {/* Botón de eliminar */}
                  <button
                    className="btn btn-danger"
                    onClick={() => eliminarSolicitud(solicitud.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No hay solicitudes disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SolicitudesPorUsuario;
