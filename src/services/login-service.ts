import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Credential} from "../model/credential";

@Injectable()
export class LoginService {
  private _isLoggedIn: boolean = false;

  constructor(private http: HttpClient) {

  }

  set isLoggedIn(isLogeedIn){
      this._isLoggedIn = isLogeedIn;
  }

  get isLoggedIn(){
    return this._isLoggedIn;
  }

  login(credential, servidor) {
    if (!!servidor.isLogarOutroServidor) {
      return this.http.post('http://' + servidor.ipServidor + '/getVeiculos', credential).map(dados => !dados.hasOwnProperty('Error'));
    }

    return this.http.post('http://95.85.11.175:8063/getVeiculos', credential).map(dados => !dados.hasOwnProperty('Error'));
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
  }

  getUsuarioLogado(): Credential {
    return JSON.parse(localStorage.getItem('usuarioLogado'));
  }
}
