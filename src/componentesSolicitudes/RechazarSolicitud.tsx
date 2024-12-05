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
}

const RechazarSolicitud: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
    const [observaciones, setObservaciones] = useState<string>(""); // Campo adicional para observaciones
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
                if (data && data.areaSolicitante) {
                    setSolicitud(data);
                } else {
                    throw new Error("La respuesta de la API no contiene la solicitud esperada.");
                }
            } catch (error: any) {
                console.error("Error al cargar la solicitud:", error);
                setError(error.message || "Hubo un problema al cargar la solicitud.");
            }
        };

        obtenerSolicitud();
    }, [id]);

    const rechazarSolicitud = async () => {
        try {
            const response = await fetch(`https://localhost:7094/api/Usuario/Rechazar/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ observaciones }), // Enviar las observaciones
            });
            if (!response.ok) {
                throw new Error("Error al rechazar la solicitud.");
            }

            navigate("/gestion-solicitudes");
        } catch (error: any) {
            setError(error.message || "Hubo un problema al rechazar la solicitud.");
        }
    };

    const imprimirSolicitud = () => {
        if (solicitud) {
            const printWindow = window.open("", "", "height=600,width=800");
            if (printWindow) {
                printWindow.document.write("<html><head><title>Solicitud</title></head><body>");
                printWindow.document.write(`<h2>Solicitud ID: ${solicitud.id}</h2>`);
                printWindow.document.write(`<p><strong>Número de Serie:</strong> ${solicitud.numeroDeSerie}</p>`);
                printWindow.document.write(`<p><strong>Fecha de Solicitud:</strong> ${solicitud.fechaSolicitud}</p>`);
                printWindow.document.write(`<p><strong>Área Solicitante:</strong> ${solicitud.areaSolicitante}</p>`);
                printWindow.document.write(`<p><strong>Tipo de Solicitud:</strong> ${solicitud.tipoSolicitud}</p>`);
                printWindow.document.write(`<p><strong>Estado:</strong> ${solicitud.estado}</p>`);
                printWindow.document.write(`<p><strong>Observaciones:</strong> ${solicitud.observaciones}</p>`);
                printWindow.document.write("</body></html>");
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Rechazar Solicitud</h2>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            {solicitud ? (
                <div>
                    <p><strong>ID:</strong> {solicitud.id}</p>
                    <p><strong>Número de Serie:</strong> {solicitud.numeroDeSerie}</p>
                    <p><strong>Fecha de Solicitud:</strong> {solicitud.fechaSolicitud}</p>
                    <p><strong>Área Solicitante:</strong> {solicitud.areaSolicitante}</p>
                    <p><strong>Tipo de Solicitud:</strong> {solicitud.tipoSolicitud}</p>
                    <p><strong>Estado:</strong> {solicitud.estado}</p>
                    <p><strong>Observaciones:</strong> {solicitud.observaciones}</p>

                    <div className="mb-3">
                        <label htmlFor="observacionesInput" className="form-label">
                            Agregar Observaciones:
                        </label>
                        <textarea
                            id="observacionesInput"
                            className="form-control"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="d-flex justify-content-center">
                        <button className="btn btn-danger mx-2" onClick={rechazarSolicitud}>
                            Rechazar Solicitud
                        </button>
                        <button className="btn btn-secondary mx-2" onClick={() => navigate("/gestion-solicitudes")}>
                            Cancelar
                        </button>
                        <button className="btn btn-info mx-2" onClick={imprimirSolicitud}>
                            Imprimir
                        </button>
                    </div>
                </div>
            ) : (
                <p>Cargando solicitud...</p>
            )}
        </div>
    );
};

export default RechazarSolicitud;
