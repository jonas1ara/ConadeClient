import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Usuario } from "../models/Usuario";

const EditarUsuario: React.FC = () => {
    const [usuario, setUsuario] = useState<Usuario>(new Usuario());
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [areas, setAreas] = useState<{ id: number, nombre: string }[]>([]);
    const [areasUsuario, setAreasUsuario] = useState<{ id: number; nombre: string }[]>([]);
    const navigate = useNavigate();
    // Datos del usuario en sesión
    const usuarioSesionRol = localStorage.getItem("rol"); // Rol del usuario en sesión
    const usuarioSesionId = localStorage.getItem("idUsuario"); // ID del usuario en sesión

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            const fetchUsuario = async () => {
                try {
                    const response = await fetch(`https://localhost:7094/api/Usuario/${id}`);
                    const data = await response.json();

                    console.log("Datos recibidos:", data); // Verifica que los datos sean correctos

                    if (data.success) {
                        const usuarioRecibido = data.obj;

                        // Asegúrate de que areaID es un arreglo
                        const usuarioConAreaID = {
                            ...usuarioRecibido,
                            areaID: Array.isArray(usuarioRecibido.areaID) ? usuarioRecibido.areaID : [],
                            rol: usuarioRecibido.rol, // Asegúrate de que el rol sea el mismo
                        };

                        setUsuario(usuarioConAreaID); // Mapear los datos del usuario a tu estado
                    } else {
                        setError(data.mensaje || "No se encontró el usuario");
                    }
                } catch (error) {
                    console.error("Error al obtener el usuario:", error);
                    setError("Error al obtener el usuario");
                }
            };

            fetchUsuario();
        }
    }, [id]);


    // Obtener áreas relacionadas con el usuario
    useEffect(() => {
        const fetchAreasPorUsuario = async () => {
            if (id) {
                try {
                    const response = await fetch(
                        `https://localhost:7094/api/Usuario/AreasPorUsuario?usuarioId=${id}`
                    );
                    const data = await response.json();

                    if (data.success) {
                        setAreasUsuario(data.obj);
                    } else {
                        setError(data.mensaje || "No se encontraron áreas relacionadas");
                    }
                } catch (error) {
                    console.error("Error al obtener áreas por usuario", error);
                    setError("Error al obtener áreas por usuario");
                }
            }
        };

        fetchAreasPorUsuario();
    }, [id]);



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

            const response = await fetch(`https://localhost:7094/api/Usuario/Editar/${usuario.id}`, {


                method: "PUT",
                headers: {
                    "Content-Type": "application/json", // Enviar como JSON
                },
                body: JSON.stringify(requestData), // Convertir el objeto a JSON

            });

            console.log("Usuario ID: " + usuario.id);

            console.log("Datos enviados al servidor:", requestData);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.mensaje || "Error en la solicitud");
            }

            setSuccessMessage("Usuario editado exitosamente");
            setTimeout(() => navigate("/gestion-usuarios"), 2000);
        } catch (error: any) {
            setError(error.message || "Error al editar el usuario");
        }
    };

    const manejarCancelar = () => {
        navigate("/gestion-usuarios");
    };

    return (
        <div className="mt-4">
            <h2 className="text-center mb-4">Editar Usuario</h2>
            {error && <div className="alert alert-danger text-center">{error}</div>}

            {successMessage && (
                <div className="alert alert-success text-center mt-4">{successMessage}</div>
            )}

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-end">Datos del Usuario</h5>

                    <div className="row">
                        {/* Columna 1: Nombre y Apellidos */}
                        <div className="col-md-4 p-3">
                            <p><strong>Nombre(s):</strong> {usuario.nombre}</p>
                            <p><strong>Apellidos:</strong> {usuario.apellidoPaterno} {usuario.apellidoMaterno}</p>

                        </div>

                        {/* Columna 2: Áreas asociadas */}
                        <div className="col-md-4 p-3">
                            <p><strong>Clave de Empleado:</strong> {usuario.claveEmpleado}</p>
                            <p><strong>Rol:</strong> {usuario.rol}</p>


                        </div>

                        {/* Columna 3: Clave de Empleado y Rol */}
                        <div className="col-md-4 p-3">
                            <p><strong>Áreas asociadas:</strong></p>
                            <ul>
                                {areasUsuario.length > 0 ? (
                                    areasUsuario.map((area) => (
                                        <li key={area.id}>{area.nombre}</li>
                                    ))
                                ) : (
                                    <p>No se han encontrado áreas asociadas.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>




            <div className="mt-4">
                <label className="form-label">Nombre de Usuario:</label>
                <input
                    className="form-control"
                    name="nombreUsuario"
                    value={usuario.nombreUsuario}
                    onChange={manejarCambio}
                    required
                />

                <label className="form-label">Contraseña:</label>
                <input
                    className="form-control"
                    name="contrasena"
                    value={usuario.contrasena}
                    onChange={manejarCambio}
                    required
                />

                <label className="form-label">Rol:</label>
                <select
                    className="form-select"
                    name="rol"
                    value={usuario.rol}
                    onChange={manejarCambio}
                    required
                    disabled={usuarioSesionRol === "Admin" && usuarioSesionId === id}
                >
                    <option value="Admin">Admin</option>
                    <option value="Usuario">Usuario</option>
                </select>

                <label className="form-label">Áreas:</label>
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

            <div className="mt-3 d-flex justify-content-between mb-4">
                <button className="btn btn-success" onClick={manejarRegistro}>
                    Editar Usuario
                </button>
                <button className="btn btn-secondary" onClick={manejarCancelar}>
                    Cancelar
                </button>
            </div>
        </div>
    );


};

export default EditarUsuario;
