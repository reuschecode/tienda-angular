import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtDto } from '../models/jwt-dto';
import { LoginUsuario } from '../models/login-usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_URL = environment.apiUrl + '/auth/';

  constructor(private http: HttpClient) {
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
    return this.http.post<JwtDto>(this.AUTH_URL + 'login', loginUsuario);
  }
}
