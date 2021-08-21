import { SubtipoProducto } from "./subtipo-producto";

export interface TipoProducto {
    idTipoProducto: number;
    nombre: string;
    subtipoProductos: SubtipoProducto[];
}