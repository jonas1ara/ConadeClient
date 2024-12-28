import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Solicitud {
    id: number;
    numeroDeSerie: string;
    fechaSolicitud: string;
    tipoSolicitud: string;
    estado: string;
    observaciones: string;
    areaSolicitante: number;
    descripcionServicio: string;
    usuarioSolicitante: number;
    areaId: number;
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
    const { state } = useLocation();  // Obtener el estado de la navegación
    const solicitud = state?.solicitud as Solicitud | null;  // Asegurarse de que la solicitud esté presente
    const [areas, setAreas] = useState<Area[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
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

        obtenerAreas();
        obtenerUsuarios();
    }, []);

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

    const imprimirSolicitud = (solicitud: Solicitud) => {
        const printWindow = window.open("", "", "height=600,width=800");
        if (printWindow) {
            printWindow.document.write(`
            <html>
                <head>
                    <title>Imprimir solicitud</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    .text-end {
                        text-align: right;
                    }
                    .details {
                        margin: 10px 0;
                    }
                    </style>
                </head>
                <body>
                    <h2 class="text-end">Solicitud de ${solicitud.tipoSolicitud}</h2>
                    <div class="details">
                        <p><strong>Número de Serie:</strong> ${solicitud.numeroDeSerie}</p>
                        <p><strong>Fecha de Solicitud:</strong> ${formatDateTime(solicitud.fechaSolicitud)}</p>
                        <p><strong>Área Solicitante:</strong> ${obtenerNombreArea(solicitud.areaSolicitante)}</p>
                        <p><strong>Estado:</strong> ${solicitud.estado}</p>
                        <p><strong>Descripción de Servicio:</strong> ${solicitud.descripcionServicio}</p>
                        <p><strong>Usuario Solicitante:</strong> ${obtenerNombreUsuario(solicitud.usuarioSolicitante)}</p>
                        ${
                            solicitud.estado === "Rechazada" || solicitud.estado === "Atendida"
                            ? `<p><strong>Observaciones:</strong> ${solicitud.observaciones}</p>`
                            : ""
                        }
                    </div>
                </body>
            </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    if (!solicitud) {
        return <div>Cargando solicitud...</div>;
    }

    return (
        <div className="mt-4">
            <h2 className="text-center mb-4">Detalles de la Solicitud</h2>
            {error && <div className="alert alert-danger text-center">{error}</div>}
            
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-end">Solicitud de {solicitud.tipoSolicitud}</h5>
                    <p><strong>Número de Serie:</strong> {solicitud.numeroDeSerie}</p>
                    <p><strong>Fecha de Solicitud:</strong> {formatDateTime(solicitud.fechaSolicitud)}</p>
                    <p><strong>Área Solicitante:</strong> {obtenerNombreArea(solicitud.areaSolicitante)}</p>
                    <p><strong>Usuario Solicitante:</strong> {obtenerNombreUsuario(solicitud.usuarioSolicitante)}</p>
                    <p><strong>Tipo de Solicitud:</strong> {solicitud.tipoSolicitud}</p>
                    <p><strong>Estado:</strong> {solicitud.estado}</p>
                    <p><strong>Descripción de Servicio:</strong> {solicitud.descripcionServicio}</p>
                    {solicitud.estado !== "Solicitada" && (
                        <p><strong>Observaciones: </strong> {solicitud.observaciones}</p>
                    )}
                </div>
            </div>

            <div className="mt-3 d-flex justify-content-between">
                <button
                    className="btn btn-secondary"
                    onClick={() => imprimirSolicitud(solicitud)}
                >
                    Imprimir
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => navigate(-1)}
                >
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default DetallesSolicitud;
