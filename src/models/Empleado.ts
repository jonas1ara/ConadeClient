export class Empleado {
    IdEmpleado?: number;
    IdUnidadNegocio?: number;
    IdCentroCostos?: number;
    IdArea?: number;
    IdRegistroPatronal?: number;
    IdEntidad?: number;
    IdPlaza?: number;
    IdUbicacion?: number;
    IdTipoRegimenSat?: number;
    IdTipoJornadaSat?: number;
    ClaveEmpleado?: string;
    Nombre?: string;
    ApellidoPaterno?: string;
    ApellidoMaterno?: string;
    Sexo?: string;
    EstadoCivil?: string;
    FechaNacimiento?: string;  // Cambié DateOnly a string porque en JS se utiliza Date o ISO 8601 como cadena
    Sd?: number;
    Sdcotizacion?: number;
    Sdi?: number;
    NetoPagar?: number;
    IdBancoTrad?: number;
    CuentaBancariaTrad?: string;
    CuentaInterbancariaTrad?: string;
    Curp?: string;
    Rfc?: string;
    Nss?: string;
    Foto?: string;
    CorreoElectronico?: string;
    CorreoElectronicoInstitucional?: string;
    Password?: string; // Para mantener la seguridad, es mejor un string o array de caracteres codificados
    FechaReconocimientoAntiguedad?: string;
    FechaIngreso?: string;
    FechaAltaSs?: string;
    FechaBaja?: string;
    MotivoBaja?: string; // ? significa que es opcional y puede ser null
    Recontratable?: string;
    IdTipoContrato?: number;
    IdPerfil?: number;
    IdEstatus?: number;
    IdCaptura?: number;
    FechaCaptura?: string;
    IdBaja?: number;
    FechaBajaSistema?: string;
    IdModificacion?: number;
    FechaModificacion?: string;
    Contrasena?: string;
    PassKiosko?: string;
    Telefono?: string;
    Celular?: string;
    Nacionalidad?: string;
    IdSindicato?: number;
    CodigoSindicato?: string;
    AfiliacionSindical?: string;
    IdCodigoPostal?: number;
    Calle?: string;
    NumeroExt?: string;
    NumeroInt?: string;
    Sni?: string;
    FechaSni?: string;
    IdCodigoPostalDf?: number;
    CalleDf?: string;
    NoExtDf?: string;
    NoIntDf?: string;
    ColoniaDf?: string;
    AlcaldiaDf?: string;
    EntidadDf?: string;
    Cpdf?: string;
    RutaCsf?: string;
    EfectoDesde?: string;
    EfectoHasta?: string;
    FechaCalculoRetroactivo?: string;
    AnionEfectivos?: number;
    QuincenaDeAniversario?: number;
    IdEmpleadoAnterior?: number;
    BanderaReactivado?: number;
    RetroactivoPagado?: number;
    IdGradoAcademico?: number;
    Observaciones?: string;
    IdTipoMovimiento?: number;
    IdLugarNacimiento?: number;
    Horario?: string;
    NoTarjeta?: string;
    IdTipoPago?: number;
    TipoSangre?: string;
    TipoVivienda?: string;
    NombreContacto?: string;
    TelefonoContacto?: string;
    Discapacidad?: string;
    Etnia?: string;
    Compensacion?: number;
    IdRecaudacion?: number;
    IdTipoRetencion?: number;
    IdRhnet?: string;
    IdShcp?: string;
    IdRusp?: string;
}
