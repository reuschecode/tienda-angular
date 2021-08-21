import { TipoProducto } from "./tipo-producto";

export interface SubtipoProducto {
    idSubtipoProducto: number;
    nombre: string;
    tipoProducto: TipoProducto;
}