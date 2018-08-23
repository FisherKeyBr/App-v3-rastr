import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Storage} from "@ionic/storage";

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, public storageService: Storage) {

  }

  login(credential) {
    return this.http.post('http://95.85.11.175:8063/getVeiculos', credential);
  }

  logout() {
    this.storageService.remove('usuarioLogado');
  }

  getUsuarioLogado() {
    return this.storageService.get('usuarioLogado');
  }
}
