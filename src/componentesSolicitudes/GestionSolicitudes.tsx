import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Solicitud {
  id: number;
  numeroDeSerie: string;
  fechaSolicitud: string;
  tipoSolicitud: string;
  estado: string;
  observaciones: string | null;
  areaSolicitante: number;
  descripcionServicio: string | null;
  usuarioSolicitante: number;
  areaId: number;
  tipoServicio?: string;
  tipoDeServicio?: string;
  fechaInicio?: string;
  fechaEntrega?: string;
  fechaEnvio?: string;
  fechaRecepcion?: string;
  fechaTransporte?: string;
  fechaTransporteVuelta?: string;
  fechaFin?: string;
  origen?: string;
  destino?: string;
  sala?: string;
  horarioInicio?: string;
  horarioFin?: string;
  tipoCombustible?: string;
  litros?: number;
  fecha?: string;
}
interface Area {
  idArea: number;
  nombreArea: string;
  id: number;
}

interface Usuario {
  id: number;
  nombreUsuario: string;
  rol: string;
}

const GestionSolicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [filtroUsuario, setFiltroUsuario] = useState<number | null>(null); // Filtro de usuario
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroAnio, setFiltroAnio] = useState<number | null>(null);
  const [filtroMes, setFiltroMes] = useState<number | null>(null);
  const [ordenFecha, setOrdenFecha] = useState<"asc" | "desc" | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [accionSeleccionada, setAccionSeleccionada] = useState<string>('');
  const solicitudesPorPagina = 10; // Número de elementos por página

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        // Obtener el usuario actual desde el localStorage (o cualquier otro estado global)
        const usuarioId = parseInt(localStorage.getItem("idUsuario") || "0");
        const usuarioRol = localStorage.getItem("rol"); // Asumimos que el rol está en el localStorage
        console.log("UsuarioId:", usuarioId); // Log para verificar el usuarioId
        console.log("Rol de usuario:", usuarioRol); // Log para verificar el rol de usuario

        if (usuarioRol !== "Admin") {
          throw new Error("El usuario no tiene permisos de administrador.");
        }

        // Obtener las áreas asignadas al usuario administrador
        const responseAreas = await fetch(`https://localhost:7094/api/Usuario/AreasPorUsuario?usuarioId=${usuarioId}`);
        if (!responseAreas.ok) {
          throw new Error("Error al obtener las áreas del usuario.");
        }

        const dataAreas = await responseAreas.json();
        console.log("Áreas obtenidas:", dataAreas); // Log para verificar la estructura

        // Asegurarnos de que dataAreas es un array antes de usar map
        if (Array.isArray(dataAreas.obj)) {
          setAreas(dataAreas.obj);
        } else {
          throw new Error("La respuesta de áreas no es un array.");
        }

        // Obtener los ids de las áreas administradas por el usuario
        const areaIds = dataAreas.obj.map((area: Area) => area.id);
        console.log("Áreas administradas por el usuario AAAAAAAAAA:", areaIds); // Log para verificar las áreas

        dataAreas.obj.forEach((area: any, index: number) => {
          console.log(`Área ${index}:`, area); // Verifica los datos en cada elemento
        });

        // Inicializar un array para almacenar las solicitudes de todas las áreas
        let todasLasSolicitudes: Solicitud[] = [];

        // Hacer peticiones para cada área administrada
        for (const areaId of areaIds) {
          let url = "";
          switch (areaId) {
            case 1: // Servicio Postal
              url = "https://localhost:7094/api/ServicioPostal/ObtenerTodos";
              break;
            case 2: // Servicio Transporte
              url = "https://localhost:7094/api/ServicioTransporte/ObtenerTodos";
              break;
            case 3: // Eventos
              url = "https://localhost:7094/api/Evento/ObtenerTodos";
              break;
            case 4: // Mantenimiento
              url = "https://localhost:7094/api/Mantenimiento/ObtenerTodos";
              break;
            case 5: // Combustible
              url = "https://localhost:7094/api/Combustible/ObtenerTodos";
              break;
            default:
              continue; // Si el área no es válida, saltamos al siguiente
          }

          // Realizar la solicitud a la API para cada área
          const responseSolicitudes = await fetch(url);
          if (!responseSolicitudes.ok) {
            throw new Error(`Error al obtener las solicitudes de la área ${areaId}.`);
          }

          const dataSolicitudes = await responseSolicitudes.json();
          console.log(`Solicitudes obtenidas para el área ${areaId}:`, dataSolicitudes); // Log para verificar las solicitudes

          if (Array.isArray(dataSolicitudes)) {
            // Unir las solicitudes obtenidas en todasLasSolicitudes
            todasLasSolicitudes = [...todasLasSolicitudes, ...dataSolicitudes];
          }
        }

        // Verificar si hay solicitudes y establecer el estado
        if (todasLasSolicitudes.length > 0) {
          setSolicitudes(todasLasSolicitudes);
          console.log("Solicitudes cargadas:", todasLasSolicitudes); // Verificar que las solicitudes se hayan cargado correctamente
        } else {
          console.log("No se encontraron solicitudes.");
          setSolicitudes([]); // Asegurarse de que el estado sea vacío si no hay solicitudes
        }

      } catch (error: any) {
        console.error("Error al cargar las solicitudes:", error);
        setError(error.message || "Hubo un problema al cargar las solicitudes.");
      }
    };

    obtenerSolicitudes();
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

  const filtrarSolicitudes = (): Solicitud[] => {
    let filtradas = solicitudes;

    if (filtroEstado) {
      filtradas = filtradas.filter((solicitud) => solicitud.estado === filtroEstado);
    }

    // Filtro por tipo de solicitud
    if (filtroTipo) {
      filtradas = filtradas.filter((solicitud) => solicitud.tipoSolicitud === filtroTipo);
    }

    if (filtroUsuario) {
      filtradas = filtradas.filter((solicitud) => solicitud.usuarioSolicitante === filtroUsuario);
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

  const aceptarSolicitud = (solicitud: Solicitud) => {
    navigate(`/aprobar-solicitud/${solicitud.id}`, {
      state: { solicitud } // Pasar el id y el tipo de solicitud como estado
    });
  };
  
  const rechazarSolicitud = (solicitud: Solicitud) => {
    navigate(`/rechazar-solicitud/${solicitud.id}`, {
      state: { solicitud } // Pasar el id y el tipo de solicitud como estado
    });
  };

  const detallesSolicitud = (solicitud: Solicitud) => {
    navigate(`/detalles-solicitud/${solicitud.id}`, {
      state: { solicitud } // Pasar la solicitud completa como estado
    });
  };

  const eliminarSolicitud = async (id: number) => {
    console.log("ID de solicitud a eliminar:", id);

    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar la solicitud?");

    if (confirmar) {
      try {
        // Obtén el usuarioId desde localStorage de manera más confiable
        const usuarioIdStr = localStorage.getItem("idUsuario");
        const usuarioId = usuarioIdStr ? parseInt(usuarioIdStr) : 0; // Si no está disponible, se asigna 0.

        if (usuarioId === 0) {
          console.error("No se encontró el usuarioId en localStorage.");
          setError("No se encontró el usuarioId en localStorage.");
          return;
        }

        console.log("ID de usuario actual:", usuarioId);

        const response = await fetch(
          `https://localhost:7094/api/usuario/EliminarSolicitudAdmin?idSolicitud=${id}&usuarioId=${usuarioId}&tipoSolicitud=${solicitudes.find(solicitud => solicitud.id === id)?.tipoSolicitud}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          throw new Error("Error al eliminar la solicitud.");
        }

        // Actualiza el estado de las solicitudes después de la eliminación
        setSolicitudes(solicitudes.filter((solicitud) => solicitud.id !== id));
      } catch (error: any) {
        console.error("Error al eliminar la solicitud:", error);
        setError(error.message || "Hubo un problema al eliminar la solicitud.");
      }

    }
  };

  const formatDateTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${formattedDate} - ${formattedTime}`;
  };

  const imprimirSolicitud = (solicitud: Solicitud) => {

    const renderCamposEspecificos = () => {
      switch (solicitud.tipoSolicitud) {
        case "Servicio Postal":
          return `
                    <p><strong>Tipo de Servicio:</strong> ${solicitud.tipoDeServicio || "No especificado"}</p>
                    <p><strong>Fecha de Envío:</strong> ${solicitud.fechaEnvio ? formatDateTime(solicitud.fechaEnvio) : "No especificada"}</p>
                    <p><strong>Fecha de Recepción:</strong> ${solicitud.fechaRecepcion ? formatDateTime(solicitud.fechaRecepcion) : "No especificada"}</p>
                `;
        case "Servicio Transporte":
          return `
                    <p><strong>Tipo de Servicio:</strong> ${solicitud.tipoDeServicio || "No especificado"}</p>
                    <p><strong>Fecha Transporte:</strong> ${solicitud.fechaTransporte ? formatDateTime(solicitud.fechaTransporte) : "No especificada"}</p>
                    <p><strong>Fecha de Recepción:</strong> ${solicitud.fechaTransporteVuelta ? formatDateTime(solicitud.fechaTransporteVuelta) : "No especificada"}</p>
                    <p><strong>Origen:</strong> ${solicitud.origen || "No especificado"}</p>
                    <p><strong>Destino:</strong> ${solicitud.destino || "No especificado"}</p>
                `;
        case "Mantenimiento":
          return `
                    <p><strong>Tipo de Servicio:</strong> ${solicitud.tipoServicio || "No especificado"}</p>
                    <p><strong>Fecha de Inicio:</strong> ${solicitud.fechaInicio ? formatDateTime(solicitud.fechaInicio) : "No especificada"}</p>
                    <p><strong>Fecha de Entrega:</strong> ${solicitud.fechaEntrega ? formatDateTime(solicitud.fechaEntrega) : "No especificada"}</p>
                `;
        case "Eventos":
          return `
                    <p><strong>Tipo de Servicio:</strong> ${solicitud.tipoServicio || "No especificado"}</p>
                    <p><strong>Sala:</strong> ${solicitud.sala || "No especificada"}</p>
                    <p><strong>Fecha de Inicio:</strong> ${solicitud.fechaInicio ? formatDateTime(solicitud.fechaInicio) : "No especificada"}</p>
                    <p><strong>Fecha de Fin:</strong> ${solicitud.fechaFin ? formatDateTime(solicitud.fechaFin) : "No especificada"}</p>
                    <p><strong>Horario de Inicio:</strong> ${solicitud.horarioInicio || "No especificado"}</p>
                    <p><strong>Horario de Fin:</strong> ${solicitud.horarioFin || "No especificado"}</p>
                `;
        case "Abastecimiento de Combustible":
          return `
                    <p><strong> Fecha de Servicio:</strong> ${solicitud.fecha ? formatDateTime(solicitud.fecha) : "No especificada"}</p>
                    <p><strong>Tipo de Combustible:</strong> ${solicitud.tipoCombustible? (solicitud.tipoCombustible) : "No especificada"}</p>
                    <p><strong>Cantidad de Litros:</strong> ${solicitud.litros? (solicitud.litros) : "No especificada"}</p>
                `;
          
        default:
          return "";
      }
    };

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
                    <p><strong>Usuario Solicitante:</strong> ${obtenerNombreUsuario(solicitud.usuarioSolicitante)}</p>
                    <p><strong>Estado:</strong> ${solicitud.estado}</p>

                    ${renderCamposEspecificos()}

                    <p><strong>Descripción de Servicio:</strong> ${solicitud.descripcionServicio}</p>
                    
                    ${solicitud.estado === "Rechazada" || solicitud.estado === "Atendida"
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
                <th>Usuario Solicitante</th>
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
                  <td>${obtenerNombreArea(solicitud.areaSolicitante)}</td>
                  <td>${obtenerNombreUsuario(solicitud.usuarioSolicitante)}</td>
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
    link.setAttribute("download", "Solicitudes.csv");
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
      <h2 className="text-center mb-4">Gestión de Solicitudes</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      

      <div className="mb-3 d-flex justify-content-between">

        <div>
          <label className="form-label">Filtrar por Tipo de Solicitud:</label>
          <select
            className="form-select"
            value={filtroTipo || ""}
            onChange={(e) => setFiltroTipo(e.target.value || null)}
          >
            <option value="">Todos</option>
            <option value="Servicio Postal">Servicio Postal</option>
            <option value="Servicio Transporte">Servicio Transporte</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Eventos">Eventos</option>
            <option value="Abastecimiento de Combustible">Abastecimiento de Combustible</option>
          </select>
        </div>

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
          <label className="form-label">Filtrar por Usuario:</label>
          <select
            className="form-select"
            value={filtroUsuario || ""}
            onChange={(e) => setFiltroUsuario(parseInt(e.target.value) || null)}
          >
            <option value="">Todos</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombreUsuario}
              </option>
            ))}
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
            <th>Usuario Solicitante</th>
            <th>Tipo de Solicitud</th>
            <th>Estado</th>
            <th>Descripción de Servicio</th>
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
                <td>{obtenerNombreUsuario(solicitud.usuarioSolicitante)}</td>
                <td>{solicitud.tipoSolicitud}</td>
                <td>{solicitud.estado}</td>
                <td>{solicitud.descripcionServicio}</td>
                <td className="d-flex justify-content-between">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => aceptarSolicitud(solicitud)}
                    disabled={solicitud.estado !== 'Solicitada'}
                  >
                    Aceptar
                  </button>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => rechazarSolicitud(solicitud)}
                    disabled={solicitud.estado !== 'Solicitada'}
                  >
                    Rechazar
                  </button>
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

export default GestionSolicitudes;