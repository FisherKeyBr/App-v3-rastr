import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {LoginService} from "../../services/login-service";
import {SettingsPage} from "../settings/settings";
import {LoginPage} from "../login/login";
import {VeiculoService} from "../../services/veiculo-service";
import {AlertaVeiculoEnum} from "../../enums/alerta-veiculo";
import {MapaPage} from "../mapa/mapa";
import {AlertService} from "../../services/alert-service";
import {HistoricoPage} from "../historico/historico";

@Component({
  selector: 'page-veiculos',
  templateUrl: 'veiculos.html'
})
export class VeiculosPage {
  veiculos: any;
  veiculosClone: any;
  filter: any;

  constructor(
    public navCtrl: NavController,
    public loginService: LoginService,
    public veiculoService: VeiculoService,
    public loadingCtrl: LoadingController,
    public alertService: AlertService
  ) {
    this.veiculos = [];
    this.filter = {};
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

  filterVeiculos(searchbar) {
    this.veiculos = this.veiculosClone;

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.veiculos = this.veiculos.filter((v) => {
      if (v.description && q) {
        if (v.description.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
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

      this.veiculosClone = Object.assign([], this.veiculos);
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

  goHistorico(deviceId) {
    this.navCtrl.push(HistoricoPage, {deviceId: deviceId});
  }

  liberarVeiculo(veiculo) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Liberando veículo...'
    });

    loading.present();
    this.veiculoService.liberarVeiculo(veiculo).subscribe(() => {
      this.alertService.showInfo('O comando foi enviado com sucesso!');
      loading.dismiss();
    }, (error) => {
      this.alertService.showError('Erro ao enviar o comando - ' + error.message);
      loading.dismiss();
    });
  }

  bloquearVeiculo(veiculo) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Bloqueando veículo...'
    });

    loading.present();
    this.veiculoService.bloquearVeiculo(veiculo).subscribe(() => {
      this.alertService.showInfo('O comando foi enviado com sucesso!');
      loading.dismiss();
    }, (error) => {
      this.alertService.showError('Erro ao enviar o comando - ' + error.message);
      loading.dismiss();
    });
  }

  ionViewDidEnter() {
    this.pesquisarVeiculos();
  }
}
