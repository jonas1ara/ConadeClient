import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Solicitud {
  id: number;
  numeroDeSerie: string;
  fechaSolicitud: string;
  tipoSolicitud: string;
  estado: string;
  observaciones: string;
  descripcionServicio: string;
  areaSolicitante: number; // Cambiado a number para relacionar con el ID
  usuarioSolicitante: number; // Cambiado a number para relacionar con el ID
}

interface Area {
  idArea: number;
  nombreArea: string;
}

interface Usuario {
  id: number;
  nombreUsuario: string;
  rol: string;
}

const SolicitudesPorUsuario: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [error, setError] = useState<string>('');
  const [usuarioSolicitanteID, setUsuarioSolicitanteID] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [ordenFecha, setOrdenFecha] = useState<"asc" | "desc" | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const solicitudesPorPagina = 10; // Número de elementos por página
  const [filtroAnio, setFiltroAnio] = useState<number | null>(null);
  const [filtroMes, setFiltroMes] = useState<number | null>(null);
  const [accionSeleccionada, setAccionSeleccionada] = useState<string>('');
  const [areas, setAreas] = useState<Area[]>([]);

  const navigate = useNavigate();


  useEffect(() => {
    const usuarioIdGuardado = localStorage.getItem("idUsuario");
    if (usuarioIdGuardado) {
      setUsuarioSolicitanteID(Number(usuarioIdGuardado));
    } else {
      setError("Usuario no encontrado. Por favor, inicie sesión.");
      console.error("usuarioId no encontrado en localStorage");
    }
  }, []);

  useEffect(() => {
      const obtenerAreas = async () => {
        try {
          const response = await fetch("https://localhost:7094/api/CatArea/Listar");
          if (!response.ok) {
            throw new Error("Error al obtener las áreas.");
          }
  
          const data = await response.json();
          console.log("Áreas cargadas:", data.catAreas);  // Log para verificar los datos
          setAreas(Array.isArray(data.catAreas) ? data.catAreas : []);
        } catch (error: any) {
          console.error("Error al cargar las áreas:", error);
          setError(error.message || "Hubo un problema al cargar las áreas.");
        }
      };
  
      obtenerAreas();
    }, []);
  
    useEffect(() => { console.log("Estado de áreas actualizado:", areas); }, [areas]);
  
    const obtenerNombreArea = (id: number) => {
      console.log("Áreas disponibles:", areas);
      const area = areas.find((area) => area.idArea === id);
      return area ? area.nombreArea : "No definida";
    };

    useEffect(() => {
        const obtenerUsuarios = async () => {
          try {
            const response = await fetch("https://localhost:7094/api/Usuario/Listar");
            if (!response.ok) {
              throw new Error("Error al obtener los usuarios.");
            }
    
            const data = await response.json();
            console.log("Usuarios cargados:", data.obj);  // Log para verificar los datos
    
            // Filtrar solo los usuarios con rol "Usuario"
            const usuariosFiltrados = data.obj.filter((usuario: Usuario) => usuario.rol === "Usuario");
    
            setUsuarios(usuariosFiltrados);
          } catch (error: any) {
            console.error("Error al cargar los usuarios:", error);
            setError(error.message || "Hubo un problema al cargar los usuarios.");
          }
        };
    
        obtenerUsuarios();
      }, []);
    
    
      useEffect(() => {
        console.log("Estado de usuarios actualizado:", usuarios);
      }, [usuarios]);
    
      const obtenerNombreUsuario = (id: number) => {
        console.log("Usuarios disponibles:", usuarios);
        const usuario = usuarios.find((usuario) => usuario.id === id);
        return usuario ? usuario.nombreUsuario : "No definido";
      };

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      if (!usuarioSolicitanteID) return;

      try {
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
  }, [usuarioSolicitanteID]);

  const filtrarSolicitudes = (): Solicitud[] => {
    let filtradas = solicitudes;

    if (filtroEstado) {
      filtradas = filtradas.filter((solicitud) => solicitud.estado === filtroEstado);
    }

    if (ordenFecha) {
      filtradas = filtradas.sort((a, b) =>
        ordenFecha === "asc"
          ? new Date(a.fechaSolicitud).getTime() - new Date(b.fechaSolicitud).getTime()
          : new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()
      );
    }

    if (filtroAnio) {
      filtradas = filtradas.filter((solicitud) => {
        const anioSolicitud = new Date(solicitud.fechaSolicitud).getFullYear();
        return anioSolicitud === filtroAnio;
      });
    }

    if (filtroMes) {
      filtradas = filtradas.filter((solicitud) => {
        const mesSolicitud = new Date(solicitud.fechaSolicitud).getMonth() + 1; // Meses en JavaScript van de 0 a 11
        return mesSolicitud === filtroMes;
      });
    }


    return filtradas;
  };

  const solicitudesFiltradas = filtrarSolicitudes();

  const indiceUltimaSolicitud = paginaActual * solicitudesPorPagina;
  const indicePrimeraSolicitud = indiceUltimaSolicitud - solicitudesPorPagina;
  const solicitudesPaginadas = solicitudesFiltradas.slice(
    indicePrimeraSolicitud,
    indiceUltimaSolicitud
  );

  const totalPaginas = Math.ceil(solicitudesFiltradas.length / solicitudesPorPagina);

  const cambiarPagina = (numero: number) => {
    setPaginaActual(numero);
  };

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

        setSolicitudes(solicitudes.filter((solicitud) => solicitud.id !== id));
      } catch (error: any) {
        console.error('Error al eliminar la solicitud:', error);
        setError(error.message || 'Hubo un problema al eliminar la solicitud.');
      }
    }
  };

  const detallesSolicitud = (solicitud: Solicitud) => {
    navigate(`/detalles-solicitud/${solicitud.id}`, {
      state: { solicitud } // Pasar la solicitud completa como estado
    });
  };
  
  
  

  const formatDateTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${formattedDate} - ${formattedTime}`;
  };

  const imprimirSolicitud = (solicitud: Solicitud) => {
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir solicitud</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              .text-end {
                text-align: right;
              }
              .details {
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <h2 class="text-end">Solicitud de ${solicitud.tipoSolicitud}</h2>
            <div class="details">
              <p><strong>Número de Serie:</strong> ${solicitud.numeroDeSerie}</p>
              <p><strong>Fecha de Solicitud:</strong> ${formatDateTime(solicitud.fechaSolicitud)}</p>
              <p><strong>Área Solicitante:</strong> ${obtenerNombreArea(solicitud.areaSolicitante)}</p>
              <p><strong>Estado:</strong> ${solicitud.estado}</p>
              <p><strong>Descripción de Servicio:</strong> ${solicitud.descripcionServicio}</p>
              <p><strong>Usuario Solicitante:</strong> ${obtenerNombreUsuario(solicitud.usuarioSolicitante)}</p>
              ${
                solicitud.estado === "Rechazada" || solicitud.estado === "Atendida"
                  ? `<p><strong>Observaciones:</strong> ${solicitud.observaciones}</p>`
                  : ""
              }
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const imprimirTodasLasSolicitudes = () => {
    const printContent = `
      <html>
      <head>
        <title>Imprimir Solicitudes</title>
      </head>
      <body>
        <h1>Lista de Solicitudes</h1>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Número de Serie</th>
              <th>Fecha de Solicitud</th>
              <th>Área Solicitante</th>
              <th>Tipo de Solicitud</th>
              <th>Estado</th>
              <th>Descripción del Servicio</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            ${solicitudesFiltradas
        .map(
          (solicitud) => `
              <tr>
                <td>${solicitud.numeroDeSerie}</td>
                <td>${formatDateTime(solicitud.fechaSolicitud)}</td>
                <td>${solicitud.areaSolicitante}</td>
                <td>${solicitud.tipoSolicitud}</td>
                <td>${solicitud.estado}</td>
                <td>${solicitud.descripcionServicio}</td>
                <td>${solicitud.observaciones}</td>
              </tr>
            `
        )
        .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(printContent);
      newWindow.document.close();
      newWindow.print();
    }
  };

  const exportarSolicitudesCSV = () => {
    const headers = [
      "Número de Serie",
      "Fecha de Solicitud",
      "Área Solicitante",
      "Tipo de Solicitud",
      "Estado",
      "Descripción del Servicio",
      "Observaciones",
    ];

    const rows = solicitudesFiltradas.map((solicitud) => [
      solicitud.numeroDeSerie,
      formatDateTime(solicitud.fechaSolicitud),
      solicitud.areaSolicitante,
      solicitud.tipoSolicitud,
      solicitud.estado,
      solicitud.descripcionServicio,
      solicitud.observaciones,
    ]);

    // Unir headers y filas
    const csvContent = [
      headers.join(","), // Encabezados
      ...rows.map((row) => row.map((value) => `"${value}"`).join(",")), // Filas con valores escapados
    ].join("\n");

    // Crear un Blob para el archivo CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Crear un enlace para descargar
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Solicitudes-por-usuario.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const manejarCambio = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    setAccionSeleccionada(evento.target.value);
  };

  const manejarAccion = () => {
    if (accionSeleccionada === 'imprimir') {
      imprimirTodasLasSolicitudes();
    } else if (accionSeleccionada === 'exportar') {
      exportarSolicitudesCSV();
    } else {
      alert('Por favor selecciona una acción.');
    }
  };



  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Solicitudes del Usuario</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="mb-3 d-flex justify-content-between">
        <div>
          <label className="form-label">Filtrar por Estado:</label>
          <select
            className="form-select"
            value={filtroEstado || ""}
            onChange={(e) => setFiltroEstado(e.target.value || null)}
          >
            <option value="">Todos</option>
            <option value="Solicitada">Solicitada</option>
            <option value="Atendida">Atendida</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        <div>
          <label className="form-label">Filtrar por Año:</label>
          <select
            className="form-select"
            value={filtroAnio || ""}
            onChange={(e) => setFiltroAnio(e.target.value ? parseInt(e.target.value, 10) : null)}
          >
            <option value="">Todos</option>
            {[2020, 2021, 2022, 2023, 2024].map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Filtrar por Mes:</label>
          <select
            className="form-select"
            value={filtroMes || ""}
            onChange={(e) => setFiltroMes(e.target.value ? parseInt(e.target.value, 10) : null)}
          >
            <option value="">Todos</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
              <option key={mes} value={mes}>
                {mes.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="form-label">Ordenar por Fecha:</label>
          <select
            className="form-select"
            value={ordenFecha || ""}
            onChange={(e) => setOrdenFecha(e.target.value as "asc" | "desc" | null)}
          >
            <option value="">Sin orden</option>
            <option value="asc">Más antiguas primero</option>
            <option value="desc">Más recientes primero</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-end">
      <div className="d-inline-block me-3">
        <select
          className="form-select"
          value={accionSeleccionada}
          onChange={manejarCambio}
        >
          <option value="">Selecciona una acción</option>
          <option value="imprimir">Imprimir Todas las Solicitudes</option>
          <option value="exportar">Exportar Solicitudes a CSV</option>
        </select>
      </div>
      <button
        className="btn btn-primary"
        onClick={manejarAccion}
        disabled={!accionSeleccionada}
      >
        Ejecutar
      </button>
    </div>


      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Número de Serie</th>
            <th>Fecha de Solicitud</th>
            <th>Área Solicitante</th>
            <th>Tipo de Solicitud</th>
            <th>Estado</th>
            <th>Descripción del Servicio</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudesPaginadas.length > 0 ? (
            solicitudesPaginadas.map((solicitud) => (
              <tr key={solicitud.numeroDeSerie}>
                <td>{solicitud.numeroDeSerie}</td>
                <td>{formatDateTime(solicitud.fechaSolicitud)}</td>
                <td>{obtenerNombreArea(solicitud.areaSolicitante)}</td>
                <td>{solicitud.tipoSolicitud}</td>
                <td>{solicitud.estado}</td>
                <td>{solicitud.descripcionServicio}</td>
                <td>{solicitud.observaciones}</td>
                <td>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => eliminarSolicitud(solicitud.id)}
                      disabled={solicitud.estado !== 'Solicitada'}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => detallesSolicitud(solicitud)}
                    >
                      Detalles
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => imprimirSolicitud(solicitud)}
                    >
                      Imprimir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                No hay solicitudes disponibles.
              </td>
            </tr>
          )}
        </tbody>

      </table>

      <div className="d-flex justify-content-center mt-3 mb-4">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => cambiarPagina(1)}
          disabled={paginaActual === 1}
        >
          Primero
        </button>

        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => {
          const pageNum = i + 1;
          const isInRange =
            pageNum === 1 ||
            pageNum === totalPaginas ||
            (pageNum >= paginaActual - 2 && pageNum <= paginaActual + 2);
          return isInRange ? (
            <button
              key={pageNum}
              className={`btn me-2 ${paginaActual === pageNum ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => cambiarPagina(pageNum)}
            >
              {pageNum}
            </button>
          ) : null;
        })}

        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => cambiarPagina(totalPaginas)}
          disabled={paginaActual === totalPaginas}
        >
          Último
        </button>
      </div>



    </div>
  );
};

export default SolicitudesPorUsuario;
