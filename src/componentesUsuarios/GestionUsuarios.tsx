import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Area {
  areaId: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  claveEmpleado: string;
  nombreUsuario: string;
  contrasena: string;
  rol: string;
  areaId: number | null;
  fechaCreacion: string;
  idEmpleado: number;
  usuarioAreas: Area[];
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<string>(''); // Estado para el filtro de búsqueda
  const [orden, setOrden] = useState<string>('desc'); // Estado para el orden (más recientes o más antiguos)
  const [rolFiltro, setRolFiltro] = useState<string>(''); // Estado para el filtro de rol
  const [paginaActual, setPaginaActual] = useState<number>(1); // Estado para la página actual
  const [usuariosPorPagina] = useState<number>(10); // Número de usuarios por página
  const [error, setError] = useState<string>('');
  const usuarioSesionId = localStorage.getItem("idUsuario"); // ID del usuario en sesión
  const usuarioSesionRol = localStorage.getItem("rol"); // Rol del usuario en sesión
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await fetch("https://localhost:7094/api/Usuario/Listar");
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios.");
        }

        const data = await response.json();
        const usuariosBase: Usuario[] = data.obj;

        // Obtener las áreas asociadas a cada usuario
        const usuariosConAreas = await Promise.all(
          usuariosBase.map(async (usuario) => {
            const areasResponse = await fetch(
              `https://localhost:7094/api/Usuario/AreasPorUsuario?usuarioId=${usuario.id}`
            );

            const areasData = await areasResponse.json();
            return { ...usuario, usuarioAreas: areasData.obj || [] };
          })
        );

        setUsuarios(usuariosConAreas);
        console.log("Usuarios cargados con áreas:", usuariosConAreas);
      } catch (error: any) {
        console.error("Error al cargar los usuarios:", error);
        setError(error.message || "Hubo un problema al cargar los usuarios.");
      }
    };

    obtenerUsuarios();
  }, []);

  // Filtro de búsqueda
  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
    setPaginaActual(1); // Reseteamos la página al buscar
  };

  // Filtro de orden (más recientes / más antiguos)
  const handleOrdenar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrden(e.target.value);
    setPaginaActual(1); // Reseteamos la página al cambiar el orden
  };

  // Filtro de rol (Admin / Usuario)
  const handleRolFiltro = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRolFiltro(e.target.value);
    setPaginaActual(1); // Reseteamos la página al cambiar el filtro de rol
  };

  // Filtramos los usuarios antes de paginar
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      ( usuario.nombreUsuario.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.apellidoPaterno.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.apellidoMaterno.toLowerCase().includes(filtro.toLowerCase())) && 
      (rolFiltro ? usuario.rol === rolFiltro : true)
  );

  // Ordenamos los usuarios según la fecha de creación
  const usuariosOrdenados = usuariosFiltrados.sort((a, b) => {
    const fechaA = new Date(a.fechaCreacion);
    const fechaB = new Date(b.fechaCreacion);
    return orden === 'desc' ? fechaB.getTime() - fechaA.getTime() : fechaA.getTime() - fechaB.getTime();
  });

  // Paginamos los usuarios filtrados y ordenados
  const totalUsuarios = usuariosOrdenados.length;
  const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);
  const usuariosPaginados = usuariosOrdenados.slice(
    (paginaActual - 1) * usuariosPorPagina,
    paginaActual * usuariosPorPagina
  );

  // Cambiar página
  const cambiarPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina);
  };

  const handleEditar = (id: number) => {
    navigate(`/editar-usuario/${id}`);
  };

  const handleEliminar = async (nombreUsuario: string) => {
    // Mostrar un alert de confirmación antes de eliminar
    const confirmacion = window.confirm(`¿Estás seguro de eliminar al usuario ${nombreUsuario}?`);

    if (!confirmacion) {
      return; // Si el usuario cancela, no hacer nada
    }

    try {
      const response = await fetch(`https://localhost:7094/api/Usuario/Eliminar?nombreUsuario=${nombreUsuario}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario.");
      }

      // Si la eliminación fue exitosa, actualizamos el estado para eliminar al usuario de la lista
      setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.nombreUsuario !== nombreUsuario));
      console.log(`Usuario ${nombreUsuario} eliminado exitosamente.`);
    } catch (error: any) {
      console.error("Error al eliminar el usuario:", error);
      setError(error.message || "Hubo un problema al eliminar el usuario.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Usuarios</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Filtros */}
      <div className="mb-3 d-flex justify-content-between">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar"
            value={filtro}
            onChange={handleBuscar}
          />
          <select className="form-select" onChange={handleOrdenar} value={orden}>
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguos</option>
          </select>
          <select className="form-select" onChange={handleRolFiltro} value={rolFiltro}>
            <option value="">Todos los roles</option>
            <option value="Admin">Admin</option>
            <option value="Usuario">Usuario</option>
          </select>
        </div>
        <Link to="/registro" className="btn btn-success">
          Registrar Nuevo Usuario
        </Link>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Clave de Empleado</th>
            <th>Nombre de Usuario</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Áreas Asociadas</th>
            <th>Fecha de Creación</th>
            <th>ID Empleado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPaginados.length > 0 ? (
            usuariosPaginados.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellidoPaterno}</td>
                <td>{usuario.apellidoMaterno}</td>
                <td>{usuario.claveEmpleado}</td>
                <td>{usuario.nombreUsuario}</td>
                <td>{usuario.contrasena}</td>
                <td>{usuario.rol}</td>
                <td>
                  {usuario.usuarioAreas.length > 0
                    ? usuario.usuarioAreas.map((ua) => ua.nombre).join(", ")
                    : "Sin áreas asociadas"}
                </td>
                <td>{new Date(usuario.fechaCreacion).toLocaleDateString()}</td>
                <td>{usuario.idEmpleado}</td>
                <td>
                  <div className="d-flex justify-content-around">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditar(usuario.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(usuario.nombreUsuario)} // Pasar nombreUsuario a la función de eliminar
                      disabled={
                        usuarioSesionRol === "Admin" &&
                        usuarioSesionId === usuario.id.toString()
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center">
                No hay usuarios disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
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

export default Usuarios;
