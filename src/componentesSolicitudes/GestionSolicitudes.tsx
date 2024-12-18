import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Solicitud {
  id: number;
  numeroDeSerie: string;
  fechaSolicitud: string;
  tipoSolicitud: string;
  estado: string;
  areaSolicitante: number; // Cambiado a number para relacionar con el ID
  usuarioSolicitante: number; // Cambiado a number para relacionar con el ID
  descripcionServicio: string;
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

const GestionSolicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [filtroUsuario, setFiltroUsuario] = useState<number | null>(null); // Filtro de usuario
  const [ordenFecha, setOrdenFecha] = useState<"asc" | "desc" | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const solicitudesPorPagina = 10; // Número de elementos por página

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const areaId = parseInt(localStorage.getItem("areaId") || "0");

        let url = "";
        switch (areaId) {
          case 1:
            url = "https://localhost:7094/api/ServicioPostal/ObtenerTodos";
            break;
          case 2:
            url = "https://localhost:7094/api/ServicioTransporte/ObtenerTodos";
            break;
          case 3:
            url = "https://localhost:7094/api/UsoInmobiliario/ObtenerTodos";
            break;
          case 4:
            url = "https://localhost:7094/api/Mantenimiento/ObtenerTodos";
            break;
          default:
            throw new Error("Área no válida o no definida.");
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener las solicitudes.");
        }

        const data = await response.json();
        setSolicitudes(Array.isArray(data) ? data : []);
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

  const aceptarSolicitud = (id: number) => navigate(`/aprobar-solicitud/${id}`);
  const rechazarSolicitud = (id: number) => navigate(`/rechazar-solicitud/${id}`);
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
          `https://localhost:7094/api/usuario/EliminarSolicitudAdmin?idSolicitud=${id}&usuarioId=${usuarioId}`,
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


  const imprimirSolicitud = (solicitud: Solicitud) => {
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write('<html><head><title>Solicitud</title></head><body>');
      printWindow.document.write(`<h2>Solicitud ID: ${solicitud.id}</h2>`);
      printWindow.document.write(`<p><strong>Número de Serie:</strong> ${solicitud.numeroDeSerie}</p>`);
      printWindow.document.write(`<p><strong>Fecha de Solicitud:</strong> ${solicitud.fechaSolicitud}</p>`);
      printWindow.document.write(`<p><strong>Área Solicitante:</strong> ${obtenerNombreArea(solicitud.areaSolicitante)}</p>`);
      printWindow.document.write(`<p><strong>Tipo de Solicitud:</strong> ${solicitud.tipoSolicitud}</p>`);
      printWindow.document.write(`<p><strong>Estado:</strong> ${solicitud.estado}</p>`);
      printWindow.document.write(`<p><strong>Descripción de Servicio:</strong> ${solicitud.descripcionServicio}</p>`);
      printWindow.document.write(`<p><strong>Usuario Solicitante:</strong> ${obtenerNombreUsuario(solicitud.usuarioSolicitante)}</p>`);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gestión de Solicitudes</h2>

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
            <th>Descripción de Servicio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudesPaginadas.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.id}</td>
              <td>{solicitud.numeroDeSerie}</td>
              <td>{solicitud.fechaSolicitud}</td>
              <td>{obtenerNombreArea(solicitud.areaSolicitante)}</td>
              <td>{obtenerNombreUsuario(solicitud.usuarioSolicitante)}</td>
              <td>{solicitud.tipoSolicitud}</td>
              <td>{solicitud.estado}</td>
              <td>{solicitud.descripcionServicio}</td>
              <td className="d-flex justify-content-between">
                <button
                  className="btn btn-success me-2"
                  onClick={() => aceptarSolicitud(solicitud.id)}
                >
                  Aceptar
                </button>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => rechazarSolicitud(solicitud.id)}
                >
                  Rechazar
                </button>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => eliminarSolicitud(solicitud.id)}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => imprimirSolicitud(solicitud)}
                >
                  Imprimir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
          <button
            key={numero}
            className={`btn me-2 ${paginaActual === numero ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => cambiarPagina(numero)}
          >
            {numero}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GestionSolicitudes;