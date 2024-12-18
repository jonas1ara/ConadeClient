import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>(""); 
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya existe un usuario en el localStorage, navegamos
    const storedUsername = localStorage.getItem("usuario");
    const storedAreaId = localStorage.getItem("areaId");
    const storedRol = localStorage.getItem("rol");

    if (storedUsername && storedAreaId && storedRol) {
      // Si ya hay un usuario en el localStorage, se redirige dependiendo de su rol
      if (storedRol === "Admin") {
        navigate("/gestion-solicitudes");
      } else if (storedRol === "Usuario") {
        navigate("/panel-principal");
      }
    }
  }, [navigate]);

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); 
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://localhost:7094/api/Usuario/Login?nombreUsuario=${username}&contrasena=${password}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.mensaje || "Credenciales incorrectas, intenta de nuevo.");
        return;
      }

      if (data.success) {
        const usuario = data.obj;
        localStorage.setItem("usuario", usuario.nombreUsuario);
        localStorage.setItem("areaId", usuario.areaId);
        localStorage.setItem("rol", usuario.rol);
        localStorage.setItem("idUsuario", usuario.id);

        // Redirigir según el rol
        if (usuario.rol === "Admin") {
          setSuccessMessage("Bienvenido, Admin!");
          navigate("/gestion-solicitudes");
        } else if (usuario.rol === "Usuario") {
          setSuccessMessage("Bienvenido!");
          navigate("/panel-principal");
        }
      }
    } catch (error: any) {
      setError("El usuario no existe en la base de datos.");
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
          {successMessage && <div className="alert alert-success text-center">{successMessage}</div>} 

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
