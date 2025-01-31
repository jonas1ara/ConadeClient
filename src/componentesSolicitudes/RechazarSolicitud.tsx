import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

// interface Solicitud {
//     id: number;
//     numeroDeSerie: string;
//     fechaSolicitud: string;
//     tipoSolicitud: string;
//     estado: string;
//     observaciones: string | null;
//     areaSolicitante: number;
//     descripcionServicio: string | null;
//     usuarioSolicitante: number;
//     areaId: number;
//     tipoServicio?: string;
//     tipoDeServicio?: string;
//     fechaInicio?: string;
//     fechaEntrega?: string;
//     fechaEnvio?: string;
//     fechaRecepcionMaxima?: string;
//     fechaTransporte?: string;
//     fechaTransporteVuelta?: string;
//     fechaFin?: string;
//     origen?: string;
//     destino?: string;
//     sala?: string;
//     horarioInicio?: string;
//     horarioFin?: string;
// }

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

    const { state } = useLocation(); // Obtén el estado de la navegación
    const solicitud = state?.solicitud; // Recupera la solicitud desde el estado

    const [areas, setAreas] = useState<Area[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [observaciones, setObservaciones] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false); // Estado para controlar el procesamiento
    const [success, setSuccess] = useState<string>(""); // Estado para manejar el mensaje de éxito

    useEffect(() => {
        const obtenerSolicitud = async () => {
            try {

                let url = "";

                console.log("ID de la solicitud:", id);
                console.log("Tipo de solicitud:", solicitud?.tipoSolicitud);

                // Comprobar el tipo de solicitud y construir la URL correspondiente
                if (solicitud?.tipoSolicitud) {
                    switch (solicitud.tipoSolicitud) {
                        case "Mantenimiento":
                            url = `https://localhost:7094/api/Mantenimiento/Obtener/${id}`;
                            break;
                        case "Servicio Postal":
                            url = `https://localhost:7094/api/ServicioPostal/ObtenerPorId/${id}`;
                            break;
                        case "Servicio Transporte":
                            url = `https://localhost:7094/api/ServicioTransporte/ObtenerPorId/${id}`;
                            break;
                        case "Evento":
                            url = `https://localhost:7094/api/Evento/ObtenerPorId/${id}`;
                            break;
                        case "Abastecimiento de Combustible":
                            url = `https://localhost:7094/api/Combustible/ObtenerPorId/${id}`;
                            break;
                        default:
                            throw new Error("Tipo de solicitud no válida.");
                    }
                } else {
                    throw new Error("Tipo de solicitud no definido.");
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Error al obtener la solicitud.");
                }

                // const data = await response.json();
                // setSolicitud(data);
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

    const rechazarSolicitud = async () => {
        try {
            setError(""); // Limpiamos el mensaje de error
            if (!solicitud) {
                setError("No se ha cargado la solicitud.");
                setIsProcessing(false); // Revertimos el estado de procesamiento
                return;
            }

            if (solicitud.estado.toLowerCase() === "rechazada") {
                setError("La solicitud ya ha sido rechazada.");
                setIsProcessing(false); // Revertimos el estado de procesamiento
                return;
            }

            // Validación de que las observaciones no estén vacías
            if (!observaciones.trim()) {
                setError("El campo observaciones es obligatorio.");
                return;
            }

            setIsProcessing(true); // Activamos el estado de procesamiento

            // Obtén el usuarioId desde localStorage de manera más confiable
            const usuarioIdStr = localStorage.getItem("idUsuario");
            const usuarioId = usuarioIdStr ? parseInt(usuarioIdStr) : 0; // Si no está disponible, se asigna 0.

            // Verificar que los datos a enviar son correctos
            console.log("Solicitud a aprobar:", solicitud);
            console.log("Usuario ID:", usuarioId);
            console.log("Observaciones:", observaciones);

            const url = `https://localhost:7094/api/Usuario/AprobarRechazarSolicitud?idSolicitud=${solicitud.id}&usuarioId=${usuarioId}&accion=Rechazar&observaciones=${encodeURIComponent(observaciones)}&tipoSolicitud=${solicitud.tipoSolicitud}`;

            console.log("URL de la solicitud:", url); // Verificar la URL que se está construyendo

            const response = await fetch(url, {
                method: "POST",
            });

            // Si la respuesta no es exitosa, manejamos el error
            if (!response.ok) {
                if (response.status === 404) {
                    const data = await response.json();
                    setError(data.mensaje || "No se pudo rechazar la solicitud.");
                } else {
                    throw new Error("Hubo un problema al rechazar la solicitud.");
                }
            } else {
                const data = await response.json();

                if (data.success) {
                    setSuccess(data.mensaje || "La solicitud ha sido aprobada con éxito."); // Establecer el mensaje de éxito

                    setTimeout(() => navigate("/gestion-solicitudes"), 4000);
                } else {
                    setError(data.mensaje || "No se pudo rechazar la solicitud.");
                }
            }
        } catch (error: any) {
            console.error("Error al rechazar la solicitud:", error);
            setError(error.message || "Hubo un problema al rechazar la solicitud.");
        } finally {
            setIsProcessing(false); // Revertimos el estado de procesamiento después de completar la operación
        }
    };

    if (!solicitud) {
        return <div>Cargando solicitud...</div>;
    }

    return (
        <div className="mt-4">
            <h2 className="text-center mb-4">Rechazar Solicitud</h2>
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {success && <div className="alert alert-success text-center">{success}</div>} {/* Mostrar mensaje de éxito */}

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-end">Detalles de la Solicitud</h5>
                    <p><strong>Número de Serie:</strong> {solicitud.numeroDeSerie}</p>
                    <p><strong>Fecha de Solicitud:</strong> {formatDateTime(solicitud.fechaSolicitud)}</p>
                    <p><strong>Área Solicitante:</strong> {obtenerNombreArea(solicitud.areaSolicitante)}</p>
                    <p><strong>Usuario Solicitante:</strong> {obtenerNombreUsuario(solicitud.usuarioSolicitante)}</p>
                    <p><strong>Estado:</strong> {solicitud.estado}</p>
                    {renderCamposEspecificos()}
                    <p><strong>Descripción de Servicio:</strong> {solicitud.descripcionServicio}</p>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Observaciones:</label>
                <textarea
                    className="form-control"
                    rows={3}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                />
            </div>

            <div className="mt-3 d-flex justify-content-between">
                <button
                    className="btn btn-success"
                    onClick={rechazarSolicitud}
                    disabled={isProcessing} // Deshabilitar mientras se procesa
                >
                    {isProcessing ? "Procesando..." : "Rechazar Solicitud"}
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => navigate("/gestion-solicitudes")}
                >
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default RechazarSolicitud;
