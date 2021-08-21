import { Tienda } from "./tienda";

export interface Usuario {
    email: string;
    nombres: string;
    activo: boolean;
    tienda: Tienda;
    idUsuario: number;
}
