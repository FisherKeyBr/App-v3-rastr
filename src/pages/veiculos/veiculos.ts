import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {LoginService} from "../../services/login-service";
import {SettingsPage} from "../settings/settings";
import {LoginPage} from "../login/login";
import {VeiculoService} from "../../services/veiculo-service";
import {AlertaVeiculoEnum} from "../../enums/alerta-veiculo";
import {MapaPage} from "../mapa/mapa";
import {AlertService} from "../../services/alert-service";

@Component({
  selector: 'page-veiculos',
  templateUrl: 'veiculos.html'
})
export class VeiculosPage {
  veiculos: any;

  constructor(
    public navCtrl: NavController,
    public loginService: LoginService,
    public veiculoService: VeiculoService,
    public loadingCtrl: LoadingController,
    public alertService: AlertService
  ) {
    this.veiculos = [];
  }

  // to go account page
  goToAccount() {
    this.navCtrl.push(SettingsPage);
  }

  getCorAlerta(historico: any) {
    if (!historico) {
      return 'light';
    }

    switch (historico.statusCode) {
      case AlertaVeiculoEnum.BATERIA_BAIXA:
        return 'yellow';
      case AlertaVeiculoEnum.VELOCIDADE_ULTRAPASSADA:
        return 'orange';
      case AlertaVeiculoEnum.PANICO:
        return 'danger';
      case AlertaVeiculoEnum.EM_MOVIMENTO:
        return 'green';
      default:
        return 'light';
    }
  }

  getDescricaoAlerta(historico) {
    if (!historico) {
      return '';
    }

    switch (historico.statusCode) {
      case AlertaVeiculoEnum.BATERIA_BAIXA:
        return 'Status: Bateria baixa';
      case AlertaVeiculoEnum.VELOCIDADE_ULTRAPASSADA:
        return 'Status: Velocidade ultrapassada';
      case AlertaVeiculoEnum.PANICO:
        return 'Status: Panico';
      case AlertaVeiculoEnum.EM_MOVIMENTO:
        return 'Status: Em movimento';
      default:
        return '';
    }
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
    this.veiculoService.getVeiculos().subscribe(retorno => {
      this.veiculos = retorno;
      loading.dismiss();
    }, (error) => {
      this.alertService.showError(error.message);
      loading.dismiss();
    });
  }

  ionViewWillEnter() {
    if (!this.loginService.usuarioLogado) {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  goMapa(deviceId) {
    this.navCtrl.push(MapaPage, {deviceId: deviceId});
  }

  ionViewDidEnter() {
    this.pesquisarVeiculos();
  }
}
