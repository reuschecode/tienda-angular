import { Empresa } from "./empresa";

export interface Tienda {
    idTienda: number;
    nombre: string;
    direccionTienda: string;
    departamentoTienda: string;
    provinciaTienda: string;
    distritoTienda: string;
    empresa: Empresa;
    urlImagen?: any;
    activo: boolean;
}