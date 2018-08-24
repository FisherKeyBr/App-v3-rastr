import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Credential} from "../model/credential";

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {

  }

  login(credential) {
    return this.http.post('http://95.85.11.175:8063/getVeiculos', credential).map(dados => !dados.hasOwnProperty('Error'));
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
  }

  getUsuarioLogado(): Credential {
    return JSON.parse(localStorage.getItem('usuarioLogado'));
  }
}
