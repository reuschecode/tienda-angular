import { Usuario } from "./usuario";

export class JwtDto {
    token: string;
    type: string;
    usuario: Usuario;
    authorities: string[];

    constructor(token: string, type: string, usuario: Usuario, authorities: string[]) {
        this.token = token;
        this.type = type;
        this.usuario = usuario;
        this.authorities = authorities;
    }
}
