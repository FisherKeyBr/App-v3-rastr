import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "./login-service";

@Injectable()
export class VeiculoService {
  constructor(private http: HttpClient, private loginService: LoginService) {

  }

  getVeiculos(id) {//se for 0 -> ALL
    return this.loginService.getUsuarioLogado().then((usuario) => {
      let params = {
        account: usuario.account,
        password: usuario.password,
        user: usuario.user,
        id: id || 'all'
      };

      return this.http.post('http://95.85.11.175:8063/getVeiculos', params);
    });
  }
}
