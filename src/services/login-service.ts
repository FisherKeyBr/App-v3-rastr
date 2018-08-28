import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Storage} from "@ionic/storage";
import {Credential} from "../model/credential";

@Injectable()
export class LoginService {
  private _usuarioLogado: Credential;

  constructor(private http: HttpClient, private storage: Storage) {

  }

  set usuarioLogado(usuario) {
    this._usuarioLogado = usuario;
  }

  get usuarioLogado():Credential {
    return this._usuarioLogado;
  }

  login(credential, servidor) {
    if (!!servidor.isLogarOutroServidor) {
      return this.http.post('http://' + servidor.ipServidor + '/getVeiculos', credential).map(dados => !dados.hasOwnProperty('Error'));
    }

    return this.http.post('http://95.85.11.175:8063/getVeiculos', credential).map(dados => !dados.hasOwnProperty('Error'));
  }

  logout() {
    return this.storage.remove('usuarioLogado');
  }
}
