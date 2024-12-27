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

const DetallesSolicitud: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [areas, setAreas] = useState<Area[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [observaciones, setObservaciones] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false); // Nuevo estado para controlar el proceso de aprobación
    const [success, setSuccess] = useState<string>(""); // Estado para manejar el mensaje de éxito

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
                        url = `https://localhost:7094/api/Mantenimiento/Obtener/${id}`;
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

    const formatDateTime = (isoDate: string): string => {
        const date = new Date(isoDate);
        const formattedDate = date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${formattedDate} - ${formattedTime}`;
    };

  
    if (!solicitud) {
        return <div>Cargando solicitud...</div>;
    }

    return (
        <div className="mt-4">
            <h2 className="text-center mb-4">Aprobar Solicitud</h2>
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {success && <div className="alert alert-success text-center">{success}</div>} {/* Mostrar mensaje de éxito */}

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-end">Detalles de la Solicitud</h5>
                    <p><strong>Número de Serie:</strong> {solicitud.numeroDeSerie}</p>
                    <p><strong>Fecha de Solicitud:</strong> {formatDateTime(solicitud.fechaSolicitud)}</p>
                    <p><strong>Área Solicitante:</strong> {obtenerNombreArea(solicitud.areaSolicitante)}</p>
                    <p><strong>Usuario Solicitante:</strong> {obtenerNombreUsuario(solicitud.usuarioSolicitante)}</p>
                    <p><strong>Tipo de Solicitud:</strong> {solicitud.tipoSolicitud}</p>
                    <p><strong>Estado:</strong> {solicitud.estado}</p>
                    <p><strong>Descripción de Servicio:</strong> {solicitud.descripcionServicio}</p>
                </div>
            </div>


            <div className="mt-4">
                <label className="form-label">Observaciones:</label>
                <textarea
                    className="form-control"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                ></textarea>
            </div>

        </div>
    );
}

export default DetallesSolicitud;
