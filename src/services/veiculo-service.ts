import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/toPromise';
import {LoginService} from "./login-service";
import {Credential} from "../model/credential";
import {AlertService} from "./alert-service";

@Injectable()
export class VeiculoService {
  constructor(private http: HttpClient, public loginService: LoginService,
              public alertService: AlertService) {
  }

  getVeiculos() {
    let token: Credential = this.loginService.usuarioLogado;
    let params = {
      account: token.account,
      user: token.user
    };

    return this.http.post('http://localhost:8063/getVeiculos', params);
  }

  getHistoricoVeiculo(deviceId, limit, dataConexao, horaConexao) {
    let token: Credential = this.loginService.usuarioLogado;

    let params = {
      account: token.account,
      user: token.user,
      deviceId: deviceId,
      limit: (limit || 1),
      date: dataConexao,
      hour: horaConexao
    };

    return this.http.post('http://localhost:8063/getHistoricoVeiculo', params);
  }

  bloquearVeiculo(veiculo) {
    if (!veiculo.notes.includes(veiculo.uniqueID)) {
      this.alertService.showError('O imei do rastreador não está ' +
        'configurado corretamente no cadastro do veículo.');
      return;
    }

    let params = {
      comando: veiculo.notes || ''
    };

    return this.http.post('http://localhost:8063/bloquear', params);
  }

  liberarVeiculo(veiculo){
    if (!veiculo.notes.includes(veiculo.uniqueID)) {
      this.alertService.showError('O imei do rastreador não está ' +
        'configurado corretamente no cadastro do veículo.');
      return;
    }

    let params = {
      comando: veiculo.notes || ''
    };

    return this.http.post('http://localhost:8063/liberar', params);
  }
}
