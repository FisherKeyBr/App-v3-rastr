import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LoginService} from "../../services/login-service";
import {SettingsPage} from "../settings/settings";
import {LoginPage} from "../login/login";
import {VeiculoService} from "../../services/veiculo-service";
import {Conta} from "../../model/conta";
import {HistoricoVeiculo} from "../../model/historico-veiculo";
import {Veiculo} from "../../model/veiculo";

@Component({
  selector: 'page-veiculos',
  templateUrl: 'veiculos.html'
})
export class VeiculosPage {
  conta: any;

  ALERTA_BATERIA: number = 64784;
  ALERTA_VELOCIDADE: number = 61722;
  ALERTA_PANICO: number = 63553;

  constructor(
    public navCtrl: NavController,
    public loginService: LoginService,
    public veiculoService: VeiculoService
  ) {
    this.executarChamadasInicial();
    this.conta = new Conta();
    this.conta.DeviceList = [];
  }

  // to go account page
  goToAccount() {
    this.navCtrl.push(SettingsPage);
  }

  getCorAlerta(historico: HistoricoVeiculo) {
    if (!historico) {
      return 'light';
    }

    switch (historico.StatusCode) {
      case this.ALERTA_BATERIA:
        return 'yellow';
      case this.ALERTA_VELOCIDADE:
        return 'orange';
      case this.ALERTA_PANICO:
        return 'danger';
      default:
        return 'light';
    }
  }

  getIndexUltimoHistorico(veiculo: Veiculo) {
    return veiculo.EventData && veiculo.EventData.length > 0 ? veiculo.EventData.length - 1 : 0;
  }

  executarChamadasInicial() {
    this.loginService.getUsuarioLogado().then((token) => {
      if (!token) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }

      this.veiculoService.getContaComVeiculos('all', token).subscribe(conta => {
        this.conta = <Conta>conta
      });
    });
  }
}
