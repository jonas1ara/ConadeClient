import React, { useState, useEffect } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  nombreUsuario: string;
  contrasena: string;
  rol: string;
  areaId: number | null;
  fechaCreacion: string;
  fechaUltimoAcceso: string | null;
  idEmpleado: number;
  area: string | null;
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await fetch("https://localhost:7094/api/Usuario/Listar");
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios.");
        }

        const data = await response.json();
        console.log("Usuarios cargados:", data.obj);
        setUsuarios(data.obj || []);
      } catch (error: any) {
        console.error("Error al cargar los usuarios:", error);
        setError(error.message || "Hubo un problema al cargar los usuarios.");
      }
    };

    obtenerUsuarios();
  }, []);

  const handleEditar = (id: number) => {
    console.log("Editar usuario con ID:", id);
    // Lógica para editar usuario
  };

  const handleEliminar = (id: number) => {
    console.log("Eliminar usuario con ID:", id);
    // Lógica para eliminar usuario
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Usuarios</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Nombre de Usuario</th>
            <th>Rol</th>
            <th>ID Área</th>
            <th>Fecha de Creación</th>
            <th>Último Acceso</th>
            <th>ID Empleado</th>
            <th>Área</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.nombreUsuario}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.areaId !== null ? usuario.areaId : "N/A"}</td>
                <td>{new Date(usuario.fechaCreacion).toLocaleDateString()}</td>
                <td>{
                  usuario.fechaUltimoAcceso
                    ? new Date(usuario.fechaUltimoAcceso).toLocaleDateString()
                    : "N/A"
                }</td>
                <td>{usuario.idEmpleado}</td>
                <td>{usuario.area || "N/A"}</td>
                <td>
                  <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEditar(usuario.id)}
                  >
                    Editar
                  </button>
                  <button
                      className="btn btn-danger me-2"
                      onClick={() => handleEliminar(usuario.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center">
                No hay usuarios disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
