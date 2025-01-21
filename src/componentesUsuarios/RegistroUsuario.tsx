import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Usuario } from "../models/Usuario";

const RegistroUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>(new Usuario());
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [areas, setAreas] = useState<{ id: number, nombre: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch("https://localhost:7094/api/Area/Listar");
        const data = await response.json();
        if (data.success) {
          setAreas(data.areas);
        }
      } catch (error) {
        console.error("Error al obtener las áreas", error);
        setError("Error al obtener las áreas");
      }
    };

    fetchAreas();
  }, [usuario.areaID]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      const area = parseInt(value, 10);

      setUsuario((prevState) => ({
        ...prevState,
        areaID: checked
          ? [...prevState.areaID, area]
          : prevState.areaID.filter((id) => id !== area),
      }));
    } else {
      const nuevoValor =
        name === "nombre" || name === "apellidoPaterno" || name === "apellidoMaterno"
          ? value.toUpperCase()
          : value;

      setUsuario({
        ...usuario,
        [name]: name === "areaID" ? parseInt(nuevoValor, 10) : nuevoValor,
      });
    }
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

      const requestData = {
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        claveEmpleado: usuario.claveEmpleado,
        nombreUsuario: usuario.nombreUsuario,
        contrasena: usuario.contrasena,
        rol: rolCapitalizado,
        areasId: usuario.areaID, // Enviar como arreglo de enteros
      };

      const response = await fetch("https://localhost:7094/api/Usuario/Crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Enviar como JSON
        },
        body: JSON.stringify(requestData), // Convertir el objeto a JSON

      });

      console.log("Datos enviados al servidor:", requestData);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensaje || "Error en la solicitud");
      }

      setSuccessMessage("Usuario creado exitosamente");
      setTimeout(() => navigate("/gestion-usuarios"), 2000);
    } catch (error: any) {
      setError(error.message || "Error al registrar el usuario");
    }
  };

  const manejarCancelar = () => {
    navigate("/gestion-usuarios");
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
            <label htmlFor="nombre" className="form-label">Nombre</label>
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
            <label htmlFor="apellidoPaterno" className="form-label">Apellido Paterno</label>
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
            <label htmlFor="apellidoMaterno" className="form-label">Apellido Materno</label>
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
            <label htmlFor="claveEmpleado" className="form-label">Clave de Empleado</label>
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
            <label htmlFor="nombreUsuario" className="form-label">Nombre de Usuario</label>
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
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
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
            <label htmlFor="rol" className="form-label">Rol</label>
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

          {(usuario.rol.toLowerCase() === "admin" || usuario.rol.toLowerCase() === "usuario") && (
            <div className="mb-3">
              <label className="form-label">Áreas</label>
              <div className="form-check">
                {areas.map((area) => (
                  <div key={area.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`area-${area.id}`}
                      name="areaID"
                      value={area.id}
                      checked={usuario.areaID.includes(area.id)}
                      onChange={manejarCambio}
                    />
                    <label className="form-check-label" htmlFor={`area-${area.id}`}>
                      {area.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">Registrar</button>
            <button type="button" className="btn btn-secondary" onClick={manejarCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroUsuario;
