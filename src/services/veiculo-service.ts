import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/toPromise';
import {LoginService} from "./login-service";
import {Credential} from "../model/credential";

@Injectable()
export class VeiculoService {
  constructor(private http: HttpClient, public loginService: LoginService) {

  }

  getVeiculos() {
    let token: Credential = this.loginService.usuarioLogado;

    let params = {
      account: token.account,
      user: token.user
    };

    return this.http.post('http://localhost:8063/getVeiculos', params);
  }

  getHistoricoVeiculo(deviceId){
    let token: Credential = this.loginService.usuarioLogado;

    let params = {
      account: token.account,
      user: token.user,
      deviceId: deviceId,
      limit:1
    };

    return this.http.post('http://localhost:8063/getHistoricoVeiculo', params);
  }
}
