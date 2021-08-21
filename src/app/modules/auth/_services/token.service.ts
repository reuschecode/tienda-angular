import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = `${environment.appVersion}-${environment.TOKEN_KEY}`;;
const EMAIL_KEY = `${environment.appVersion}-${environment.USERDATA_KEY}`;;
const AUTHORITIES_KEY = `${environment.appVersion}-${environment.ROLES_KEY}`;

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    roles: Array<string> = [];

    constructor() { }

    public setToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    public setUser(user: Usuario): void {
        window.sessionStorage.removeItem(EMAIL_KEY);
        window.sessionStorage.setItem(EMAIL_KEY, JSON.stringify(user));
    }

    public getUser(): Usuario | null {
        return JSON.parse(sessionStorage.getItem(EMAIL_KEY));
    }

    public setAuthorities(authorities: string[]): void {
        window.sessionStorage.removeItem(AUTHORITIES_KEY);
        window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
    }

    public getAuthorities(): string[] {
        this.roles = [];
        if (sessionStorage.getItem(AUTHORITIES_KEY)) {
            JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY) || '{}').forEach((authority: { authority: string; }) => {
                this.roles.push(authority.authority);
            });
        }
        return this.roles;
    }

    public logOut(): void {
        window.sessionStorage.clear();
    }
}
