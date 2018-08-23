import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Storage} from "@ionic/storage";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, public storage: Storage) {

  }

  login(credential) {
    return <Observable<any>>this.http.post('http://95.85.11.175:8063/getVeiculos', credential);
  }

  logout() {
    this.storage.remove('usuarioLogado');
  }

  getUsuarioLogado(): Promise<any> {
    return this.storage.get('usuarioLogado');
  }
}
