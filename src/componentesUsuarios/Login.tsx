import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>(""); // Estado para mensaje de éxito
  const navigate = useNavigate();

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Limpiamos el mensaje de éxito antes de intentar el login
    setIsLoading(true);

    try {
      // Realizamos la petición de login
      const response = await fetch(
        `https://localhost:7094/api/Usuario/Login?nombreUsuario=${username}&contrasena=${password}`,
        {
          method: "GET", // Usamos GET ya que estamos enviando los parámetros en la URL
        }
      );

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();

      // Asumimos que la respuesta tiene un campo `role` que determina a dónde redirigir
      if (data.success) {
        // Si el login es exitoso, verificamos el rol
        const usuario = data.obj; // Asumiendo que la respuesta tiene el usuario con su rol
        localStorage.setItem("usuario", usuario.nombreUsuario); // Guardamos el usuario en localStorage

        if (usuario.rol === "Admin") {
          setSuccessMessage("Bienvenido, Admin!"); // Mensaje de éxito para Admin
          navigate("/gestion-solicitudes"); // Redirigimos al área de gestión de solicitudes
        } else if (usuario.rol === "Usuario") {
          setSuccessMessage("Bienvenido!"); // Mensaje de éxito para Usuario
          navigate("/panel-principal"); // Redirigimos al panel principal del usuario
        }
      } else {
        // Si el login no fue exitoso, mostramos el mensaje de error
        setError(data.mensaje || "Credenciales incorrectas, intenta de nuevo.");
      }
    } catch (error: any) {
      setError("No se pudo conectar con el servidor. Intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <form onSubmit={manejarLogin}>
          <h2 className="text-center">Iniciar Sesión</h2>

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {successMessage && <div className="alert alert-success text-center">{successMessage}</div>} {/* Mostrar mensaje de éxito */}

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
            <Link to="/registro" className="btn btn-secondary">
              Registrar Usuario
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
