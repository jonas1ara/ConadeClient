export class Usuario {
    id: number = 0; // Valor predeterminado
    nombre: string = "";
    apellidoPaterno: string = "";
    apellidoMaterno: string = "";
    claveEmpleado: string = "";
    nombreUsuario: string = ""; 
    contrasena: string = "";
    rol: string = ""; // Asignar valor por defecto
    fechaCreacion?: Date;
    fechaUltimoAcceso?: Date;
    idEmpleado?: number;
}
