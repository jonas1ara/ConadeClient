import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Usuario } from "../models/Usuario"; // Importar el modelo Usuario

const RegistroUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>(new Usuario()); // Usamos el modelo Usuario
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>(""); // Definir el estado successMessage
  const navigate = useNavigate();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Actualizamos el estado del usuario con los valores de los inputs
    setUsuario({
      ...usuario,
      [name]: value,
    });
  };

  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };
  
  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Limpiar mensaje de éxito antes de intentar el registro
  
    try {
      // Usamos la función para capitalizar el rol
      const rolCapitalizado = capitalizeRole(usuario.rol);
  
      // Construir la URL con los parámetros de consulta
      const url = `https://localhost:7094/api/Usuario/Crear?nombre=${encodeURIComponent(usuario.nombre)}&apellidoPaterno=${encodeURIComponent(usuario.apellidoPaterno)}&apellidoMaterno=${encodeURIComponent(usuario.apellidoMaterno)}&claveEmpleado=${encodeURIComponent(usuario.claveEmpleado)}&nombreUsuario=${encodeURIComponent(usuario.nombreUsuario)}&contrasena=${encodeURIComponent(usuario.contrasena)}&rol=${encodeURIComponent(rolCapitalizado)}`;
  
      // Realizamos la petición de registro
      const response = await fetch(url, {
        method: "POST", // Mantenemos POST aunque los datos se pasan en la URL
      });
  
      if (!response.ok) {
        throw new Error("Hubo un error al crear el usuario");
      }
  
      const data = await response.json();
      setSuccessMessage("Usuario creado exitosamente"); // Actualizar el mensaje de éxito
      // Redirigir a otra página, si es necesario
      navigate("/"); // O a la pantalla de login, por ejemplo
    } catch (error: any) {
      setError(error.message || "Error al registrar el usuario");
    }
  };
  

  const manejarCancelar = () => {
    navigate("/"); // Redirige al login si se cancela
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center">Registrar Usuario</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {successMessage && <div className="alert alert-success text-center">{successMessage}</div>} {/* Mostrar mensaje de éxito */}
        <form onSubmit={manejarRegistro}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={usuario.nombre}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidoPaterno" className="form-label">
              Apellido Paterno
            </label>
            <input
              type="text"
              id="apellidoPaterno"
              name="apellidoPaterno"
              className="form-control"
              value={usuario.apellidoPaterno}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidoMaterno" className="form-label">
              Apellido Materno
            </label>
            <input
              type="text"
              id="apellidoMaterno"
              name="apellidoMaterno"
              className="form-control"
              value={usuario.apellidoMaterno}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="claveEmpleado" className="form-label">
              Clave de Empleado
            </label>
            <input
              type="text"
              id="claveEmpleado"
              name="claveEmpleado"
              className="form-control"
              value={usuario.claveEmpleado}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nombreUsuario" className="form-label">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="nombreUsuario"
              name="nombreUsuario"
              className="form-control"
              value={usuario.nombreUsuario}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              className="form-control"
              value={usuario.contrasena}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="rol" className="form-label">
              Rol
            </label>
            <select
              id="rol"
              name="rol"
              className="form-select"
              value={usuario.rol}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccionar rol</option>
              <option value="admin">Admin</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
            <button type="button" className="btn btn-secondary" onClick={manejarCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroUsuario;
