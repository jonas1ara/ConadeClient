import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Solicitud {
    id: number;
    numeroDeSerie: string;
    fechaSolicitud: string;
    tipoSolicitud: string;
    estado: string;
    observaciones: string | null;
    areaSolicitante: number;
    descripcionServicio: string | null;
    usuarioSolicitante: number;
    areaId: number;
    tipoServicio?: string;
    tipoDeServicio?: string;
    fechaInicio?: string;
    fechaEntrega?: string;
    fechaEnvio?: string;
    fechaRecepcion?: string;
    fechaTransporte?: string;
    fechaTransporteVuelta?: string;
    fechaFin?: string;
    origen?: string;
    destino?: string;
    sala?: string;
    horarioInicio?: string;
    horarioFin?: string;
    tipoCombustible?: string;
    litros?: number;
    fecha?: string;
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
    const { state } = useLocation();
    const solicitud = state?.solicitud as Solicitud | null;
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

    const renderCamposEspecificos = () => {
        switch (solicitud?.tipoSolicitud) {
            case "Mantenimiento":
                return (
                    <>
                        {solicitud.tipoServicio && <p><strong>Tipo de Servicio:</strong> {solicitud.tipoServicio}</p>}
                        {solicitud.fechaInicio && <p><strong>Fecha de Inicio:</strong> {formatDateTime(solicitud.fechaInicio)}</p>}
                        {solicitud.fechaEntrega && <p><strong>Fecha de Entrega:</strong> {formatDateTime(solicitud.fechaEntrega)}</p>}
                    </>
                );
            case "Servicio Postal":
                return (
                    <>
                        {solicitud.tipoDeServicio && <p><strong>Tipo de Servicio:</strong> {solicitud.tipoDeServicio}</p>}
                        {solicitud.fechaEnvio && <p><strong>Fecha de Envío:</strong> {formatDateTime(solicitud.fechaEnvio)}</p>}
                        {solicitud.fechaRecepcion && <p><strong>Fecha de Recepción:</strong> {formatDateTime(solicitud.fechaRecepcion)}</p>}
                    </>
                );
            case "Servicio Transporte":
                return (
                    <>
                        {solicitud.tipoDeServicio && <p><strong>Tipo de Servicio:</strong> {solicitud.tipoDeServicio}</p>}
                        {solicitud.fechaTransporte && <p><strong>Fecha de Transporte:</strong> {formatDateTime(solicitud.fechaTransporte)}</p>}
                        {solicitud.fechaTransporteVuelta && <p><strong>Fecha de Recepción:</strong> {formatDateTime(solicitud.fechaTransporteVuelta)}</p>}
                        {solicitud.origen && <p><strong>Origen:</strong> {solicitud.origen}</p>}
                        {solicitud.destino && <p><strong>Destino:</strong> {solicitud.destino}</p>}
                    </>
                );
            case "Eventos":
                return (
                    <>
                        {solicitud.tipoServicio && <p><strong>Tipo de Servicio:</strong> {solicitud.tipoServicio}</p>}
                        {solicitud.sala && <p><strong>Sala:</strong> {solicitud.sala}</p>}
                        {solicitud.fechaInicio && <p><strong>Fecha de Inicio:</strong> {formatDateTime(solicitud.fechaInicio)}</p>}
                        {solicitud.fechaFin && <p><strong>Fecha de Fin:</strong> {formatDateTime(solicitud.fechaFin)}</p>}
                        {solicitud.horarioInicio && <p><strong>Horario de Inicio:</strong> {solicitud.horarioInicio}</p>}
                        {solicitud.horarioFin && <p><strong>Horario de Fin:</strong> {solicitud.horarioFin}</p>}
                    </>
                );
            case "Abastecimiento de Combustible":
                return (
                    <>
                        {solicitud.fecha && <p><strong>Fecha de Servicio:</strong> {formatDateTime(solicitud.fecha)}</p>}
                        {solicitud.tipoCombustible && <p><strong>Tipo de Combustible:</strong> {solicitud.tipoCombustible}</p>}
                        {solicitud.litros && <p><strong>Cantidad de Litros:</strong> {solicitud.litros}</p>}
                    </>
                )
            
            default:
                return null;
        }
    };

    const imprimirSolicitud = (solicitud: Solicitud) => {

        const renderCamposEspecificos = () => {
            switch (solicitud.tipoSolicitud) {
                case "Servicio Postal":
                    return `
                        <p><strong>Tipo de Servicio:</strong> ${solicitud.tipoDeServicio || "No especificado"}</p>
                        <p><strong>Fecha de Envío:</strong> ${solicitud.fechaEnvio ? formatDateTime(solicitud.fechaEnvio) : "No especificada"}</p>
                        <p><strong>Fecha Recepción:</strong> ${solicitud.fechaRecepcion? formatDateTime(solicitud.fechaRecepcion) : "No especificada"}</p>
                    `;
                case "Servicio Transporte":
                    return `
                        <p><strong>Tipo de Servicio:</strong> ${solicitud.tipoDeServicio || "No especificado"}</p>
                        <p><strong>Fecha de Transporte:</strong> ${solicitud.fechaTransporte ? formatDateTime(solicitud.fechaTransporte) : "No especificada"}</p>
                        <p><strong>Fecha de Recepción:</strong> ${solicitud.fechaTransporteVuelta ? formatDateTime(solicitud.fechaTransporteVuelta) : "No especificada"}</p>
                        <p><strong>Origen:</strong> ${solicitud.origen || "No especificado"}</p>
                        <p><strong>Destino:</strong> ${solicitud.destino || "No especificado"}</p>
                    `;
                case "Mantenimiento":
                    return `
                        <p><strong>Tipo de Servicio:</strong> ${solicitud.tipoServicio || "No especificado"}</p>
                        <p><strong>Fecha de Inicio:</strong> ${solicitud.fechaInicio ? formatDateTime(solicitud.fechaInicio) : "No especificada"}</p>
                        <p><strong>Fecha de Entrega:</strong> ${solicitud.fechaEntrega ? formatDateTime(solicitud.fechaEntrega) : "No especificada"}</p>
                    `;
                case "Eventos":
                    return `
                        <p><strong>Tipo de Servicio:</strong> ${solicitud.tipoServicio || "No especificado"}</p>
                        <p><strong>Sala:</strong> ${solicitud.sala || "No especificada"}</p>
                        <p><strong>Fecha de Inicio:</strong> ${solicitud.fechaInicio ? formatDateTime(solicitud.fechaInicio) : "No especificada"}</p>
                        <p><strong>Fecha de Fin:</strong> ${solicitud.fechaFin ? formatDateTime(solicitud.fechaFin) : "No especificada"}</p>
                        <p><strong>Horario de Inicio:</strong> ${solicitud.horarioInicio || "No especificado"}</p>
                        <p><strong>Horario de Fin:</strong> ${solicitud.horarioFin || "No especificado"}</p>
                    `;
                case "Abastecimiento de Combustible":
                    return `
                         <p><strong> Fecha de Servicio:</strong> ${solicitud.fecha ? formatDateTime(solicitud.fecha) : "No especificada"}</p>
                        <p><strong>Tipo de Combustible:</strong> ${solicitud.tipoCombustible ? (solicitud.tipoCombustible) : "No especificada"}</p>
                        <p><strong>Cantidad de Litros:</strong> ${solicitud.litros ? (solicitud.litros) : "No especificada"}</p>
                    `;
                default:
                    return "";
            }
        };

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
                        <p><strong>Usuario Solicitante:</strong> ${obtenerNombreUsuario(solicitud.usuarioSolicitante)}</p>
                        <p><strong>Estado:</strong> ${solicitud.estado}</p>

                        ${renderCamposEspecificos()}

                        <p><strong>Descripción de Servicio:</strong> ${solicitud.descripcionServicio}</p>
                        
                        ${solicitud.estado === "Rechazada" || solicitud.estado === "Atendida"
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
                    <p><strong>Estado:</strong> {solicitud.estado}</p>
                    {renderCamposEspecificos()}
                    {solicitud.descripcionServicio && (
                        <p><strong>Descripción de Servicio:</strong> {solicitud.descripcionServicio}</p>
                    )}
                    {solicitud.observaciones && (
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
