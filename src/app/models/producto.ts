import { BaseModel } from "../_metronic/shared/crud-table";
import { Empresa } from "./empresa";
import { MarcaProducto } from "./marca-producto";
import { SubtipoProducto } from "./subtipo-producto";

export interface Producto extends BaseModel {
    idProducto: number;
    nombre: string;
    precio: number;
    urlImagen: string;
    activo: boolean;
    empresa: Empresa;
    subtipoProducto: SubtipoProducto;
    marcaProducto: MarcaProducto;
}