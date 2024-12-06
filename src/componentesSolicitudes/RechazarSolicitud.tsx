import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Solicitud {
    id: number;
    numeroDeSerie: string;
    fechaSolicitud: string;
    tipoSolicitud: string;
    estado: string;
    observaciones: string;
    areaSolicitante: number;
    descripcionServicio: string;
    usuarioSolicitante: number; // Para relacionar con el ID del usuario
}

interface Area {
    idArea: number;
    nombreArea: string;
}

interface Usuario {
    id: number;
    nombreUsuario: string;
}

const RechazarSolicitud: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [areas, setAreas] = useState<Area[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [observaciones, setObservaciones] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const obtenerSolicitud = async () => {
            try {
                const areaId = parseInt(localStorage.getItem("areaId") || "0");

                let url = "";
                switch (areaId) {
                    case 1:
                        url = `https://localhost:7094/api/ServicioPostal/ObtenerPorId/${id}`;
                        break;
                    case 2:
                        url = `https://localhost:7094/api/ServicioTransporte/ObtenerPorId/${id}`;
                        break;
                    case 3:
                        url = `https://localhost:7094/api/UsoInmobiliario/ObtenerPorId/${id}`;
                        break;
                    case 4:
                        url = `https://localhost:7094/api/Mantenimiento/ObtenerPorId/${id}`;
                        break;
                    default:
                        throw new Error("Área no válida o no definida.");
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Error al obtener la solicitud.");
                }

                const data = await response.json();
                setSolicitud(data);
            } catch (error: any) {
                console.error("Error al cargar la solicitud:", error);
                setError(error.message || "Hubo un problema al cargar la solicitud.");
            }
        };

        const obtenerAreas = async () => {
            try {
                const response = await fetch("https://localhost:7094/api/CatArea/Listar");
                if (!response.ok) {
                    throw new Error("Error al obtener las áreas.");
                }
                const data = await response.json();
                setAreas(Array.isArray(data.catAreas) ? data.catAreas : []);
            } catch (error: any) {
                console.error("Error al cargar las áreas:", error);
                setError(error.message || "Hubo un problema al cargar las áreas.");
            }
        };

        const obtenerUsuarios = async () => {
            try {
                const response = await fetch("https://localhost:7094/api/Usuario/Listar");
                if (!response.ok) {
                    throw new Error("Error al obtener los usuarios.");
                }
                const data = await response.json();
                setUsuarios(Array.isArray(data.obj) ? data.obj : []);
            } catch (error: any) {
                console.error("Error al cargar los usuarios:", error);
                setError(error.message || "Hubo un problema al cargar los usuarios.");
            }
        };

        obtenerSolicitud();
        obtenerAreas();
        obtenerUsuarios();
    }, [id]);

    const obtenerNombreArea = (id: number) => {
        const area = areas.find((area) => area.idArea === id);
        return area ? area.nombreArea : "No definida";
    };

    const obtenerNombreUsuario = (id: number) => {
        const usuario = usuarios.find((usuario) => usuario.id === id);
        return usuario ? usuario.nombreUsuario : "No definido";
    };

    const rechazarSolicitud = async () => {
        try {
            if (!solicitud) {
                setError("No se ha cargado la solicitud.");
                return;
            }

            if (solicitud.estado.toLowerCase() === "rechazada") {
                setError("La solicitud ya ha sido rechazada.");
                return;
            }

            // Obtén el usuarioId desde localStorage de manera más confiable
            const usuarioIdStr = localStorage.getItem("idUsuario");
            const usuarioId = usuarioIdStr ? parseInt(usuarioIdStr) : 0; // Si no está disponible, se asigna 0.

            // Verificar que los datos a enviar son correctos
            console.log("Solicitud a aprobar:", solicitud);
            console.log("Usuario ID:", usuarioId);
            console.log("Observaciones:", observaciones);

            const url = `https://localhost:7094/api/Usuario/AprobarRechazarSolicitud?idSolicitud=${solicitud.id}&usuarioId=${usuarioId}&accion=Rechazar&observaciones=${encodeURIComponent(observaciones)}`;

            console.log("URL de la solicitud:", url); // Verificar la URL que se está construyendo

            const response = await fetch(url, {
                method: "POST",
            });

            // Si la respuesta no es exitosa, manejamos el error
            if (!response.ok) {
                // Si el código de estado es 404 (No encontrado), mostramos el mensaje del JSON
                if (response.status === 404) {
                    const data = await response.json();
                    setError(data.mensaje || "No se pudo rechazar la solicitud.");
                } else {
                    throw new Error("Hubo un problema al rechazar la solicitud.");
                }
            } else {
                const data = await response.json();
                if (data.success) {
                    alert("La solicitud ha sido rechazada");
                    navigate("/gestion-solicitudes");
                } else {
                    setError(data.mensaje || "No se pudo rechazar la solicitud.");
                }
            }
        } catch (error: any) {
            console.error("Error al rechazar la solicitud:", error);
            setError(error.message || "Hubo un problema al rechazar la solicitud.");
        }
    };


    if (!solicitud) {
        return <div>Cargando solicitud...</div>;
    }

    return (
        <div className="mt-4">
            <h2 className="text-center mb-4">Rechazar Solicitud</h2>
            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="mb-3">
                <label className="form-label">Solicitud ID:</label>
                <input
                    type="text"
                    className="form-control"
                    value={solicitud.id}
                    readOnly
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Número de Serie:</label>
                <input
                    type="text"
                    className="form-control"
                    value={solicitud.numeroDeSerie}
                    readOnly
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Fecha de Solicitud:</label>
                <input
                    type="text"
                    className="form-control"
                    value={solicitud.fechaSolicitud}
                    readOnly
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Área Solicitante:</label>
                <input
                    type="text"
                    className="form-control"
                    value={obtenerNombreArea(solicitud.areaSolicitante)}
                    readOnly
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Usuario Solicitante:</label>
                <input
                    type="text"
                    className="form-control"
                    value={obtenerNombreUsuario(solicitud.usuarioSolicitante)}
                    readOnly
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Tipo de Solicitud:</label>
                <input
                    type="text"
                    className="form-control"
                    value={solicitud.tipoSolicitud}
                    readOnly
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Estado:</label>
                <input
                    type="text"
                    className="form-control"
                    value={solicitud.estado}
                    readOnly
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Descripción de Servicio:</label>
                <textarea
                    className="form-control"
                    value={solicitud.descripcionServicio}
                    readOnly
                />
            </div>

            <div className="mt-4">
                <label className="form-label">Observaciones:</label>
                <textarea
                    className="form-control"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                ></textarea>
            </div>

            <div className="mt-3 d-flex justify-content-between">
                <button className="btn btn-danger" onClick={rechazarSolicitud}>
                    Rechazar
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/gestion-solicitudes")}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default RechazarSolicitud;