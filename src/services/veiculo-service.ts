import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/toPromise';
import {LoginService} from "./login-service";
import {Credential} from "../model/credential";

@Injectable()
export class VeiculoService {
  constructor(private http: HttpClient, public loginService: LoginService) {

  }

  getVeiculos(id) {
    let token: Credential = this.loginService.usuarioLogado;

    let params = {
      account: token.account,
      password: token.password,
      user: token.user,
      id: id || 'all'
    };

    return this.http.post('http://95.85.11.175:8063/getVeiculos', params).map((dados) => dados['DeviceList']);
  }
}
