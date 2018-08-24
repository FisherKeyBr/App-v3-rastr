import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {LoginService} from "../../services/login-service";
import {SettingsPage} from "../settings/settings";
import {LoginPage} from "../login/login";
import {VeiculoService} from "../../services/veiculo-service";
import {HistoricoVeiculo} from "../../model/historico-veiculo";
import {Veiculo} from "../../model/veiculo";

@Component({
  selector: 'page-veiculos',
  templateUrl: 'veiculos.html'
})
export class VeiculosPage {
  veiculos: any;

  ALERTA_BATERIA: number = 64784;
  ALERTA_VELOCIDADE: number = 61722;
  ALERTA_PANICO: number = 63553;
  ALERTA_EM_MOVIMENTO: number = 61714;

  constructor(
    public navCtrl: NavController,
    public loginService: LoginService,
    public veiculoService: VeiculoService,
    public loadingCtrl: LoadingController
  ) {
    this.veiculos = [];
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
      case this.ALERTA_EM_MOVIMENTO:
        return 'green';
      default:
        return 'light';
    }
  }

  getDescricaoAlerta(historico) {
    if (!historico) {
      return '';
    }

    switch (historico.StatusCode) {
      case this.ALERTA_BATERIA:
        return 'Status: Bateria baixa';
      case this.ALERTA_VELOCIDADE:
        return 'Status: Velocidade ultrapassada';
      case this.ALERTA_PANICO:
        return 'Status: Panico';
      case this.ALERTA_EM_MOVIMENTO:
        return 'Status: Em movimento';
      default:
        return '';
    }
  }

  getIndexUltimoHistorico(veiculo: Veiculo) {
    return veiculo.EventData && veiculo.EventData.length > 0 ? veiculo.EventData.length - 1 : 0;
  }

  atualizarVeiculos(refresher) {
    this.pesquisarVeiculos();
    refresher.complete();
  }

  pesquisarVeiculos() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Por favor aguarde...'
    });

    loading.present();
    this.veiculoService.getVeiculos('0153').subscribe(retorno => {
      this.veiculos = retorno;
      loading.dismiss();
    }, loading.dismiss);
  }

  ionViewWillEnter() {
    if (!this.loginService.getUsuarioLogado()) {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  ionViewDidEnter() {
    this.pesquisarVeiculos();
  }
}
