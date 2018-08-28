import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {LoginService} from "../../services/login-service";
import {SettingsPage} from "../settings/settings";
import {LoginPage} from "../login/login";
import {VeiculoService} from "../../services/veiculo-service";
import {HistoricoVeiculo} from "../../model/historico-veiculo";
import {Veiculo} from "../../model/veiculo";
import {AlertaVeiculoEnum} from "../../enums/alerta-veiculo";
import {MapaPage} from "../mapa/mapa";

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

    switch (historico.StatusCode) {
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
    if (!this.loginService.usuarioLogado) {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  goMapa(historicos: Array<HistoricoVeiculo>) {
    this.navCtrl.push(MapaPage, {historicos: historicos});
  }

  ionViewDidEnter() {
    this.pesquisarVeiculos();
  }
}
