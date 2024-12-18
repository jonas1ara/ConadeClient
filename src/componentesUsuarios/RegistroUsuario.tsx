import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Usuario } from "../models/Usuario";

const RegistroUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>(new Usuario());
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Aseguramos que el areaID siempre tenga un valor numérico
    if (usuario.areaID === undefined) {
      setUsuario((prevState) => ({
        ...prevState,
        areaID: 1, // Establecemos un valor inicial por defecto (ejemplo: 1)
      }));
    }
  }, [usuario.areaID]);

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Convertir los campos 'nombre', 'apellidoPaterno', 'apellidoMaterno' a mayúsculas
    const nuevoValor =
      name === "nombre" || name === "apellidoPaterno" || name === "apellidoMaterno"
        ? value.toUpperCase()
        : value;

    // Aseguramos que el campo areaID se maneje como número y no como string
    setUsuario({
      ...usuario,
      [name]: name === "areaID" ? parseInt(nuevoValor, 10) : nuevoValor,
    });
  };

  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const rolCapitalizado = capitalizeRole(usuario.rol);

      const url = `https://localhost:7094/api/Usuario/Crear?nombre=${encodeURIComponent(
        usuario.nombre
      )}&apellidoPaterno=${encodeURIComponent(
        usuario.apellidoPaterno
      )}&apellidoMaterno=${encodeURIComponent(
        usuario.apellidoMaterno
      )}&claveEmpleado=${encodeURIComponent(
        usuario.claveEmpleado
      )}&nombreUsuario=${encodeURIComponent(
        usuario.nombreUsuario
      )}&contrasena=${encodeURIComponent(
        usuario.contrasena
      )}&rol=${encodeURIComponent(rolCapitalizado)}${rolCapitalizado === "Admin" ? `&areaID=${usuario.areaID}` : ""
        }`;

      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensaje); // Enviamos el mensaje de error recibido

      }

      setSuccessMessage("Usuario creado exitosamente");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      setError(error.message || "Error al registrar el usuario");
    }
  };

  const manejarCancelar = () => {
    navigate("/");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center">Registrar Usuario</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {successMessage && (
          <div className="alert alert-success text-center">
            {successMessage}
          </div>
        )}
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
          {usuario.rol.toLowerCase() === "admin" && (
            <div className="mb-3">
              <label htmlFor="areaID" className="form-label">
                Área
              </label>
              <select
                id="areaID"
                name="areaID"
                className="form-select"
                value={usuario.areaID}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccionar área</option>
                <option value="1">Servicio postal</option>
                <option value="2">Servicio de transporte</option>
                <option value="3">Uso de auditorios</option>
                <option value="4">Mantenimiento</option>
              </select>
            </div>
          )}
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={manejarCancelar}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroUsuario;
