import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {VeiculoService} from "../../services/veiculo-service";
import {AlertService} from "../../services/alert-service";
import {MapaPage} from "../mapa/mapa";
import {Observable} from "rxjs";

/**
 * Generated class for the HistoricoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {
  historicos: any;
  filter: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public veiculoService: VeiculoService,
              public loadingCtrl: LoadingController,
              public alertService: AlertService) {
    this.historicos = [];
    this.filter = {};
  }

  ionViewDidEnter() {
    if (this.navParams.get('deviceId')) {
      this.filter.deviceID = this.navParams.get('deviceId');
      this.pesquisarHistorico();
    }
  }

  pesquisarHistorico() {
    if (!this.filter.deviceID) {
      this.alertService.showAlert('É necessário informar o Código do veículo');
      return;
    }

    if (this.filter.limit > 99) {
      this.alertService.showAlert('O limite máximo da consulta é 99.');
      return;
    }

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Por favor aguarde...'
    });

    loading.present();
    this.veiculoService.getHistoricoVeiculo(this.filter.deviceID, (this.filter.limit || 30),
      this.filter.date, this.filter.hour).subscribe(retorno => {
      this.historicos = retorno;

      if (this.historicos && this.historicos.length <= 0) {
        this.alertService.showAlert('Não foi encontrado nenhum histórico com os filtros informado.');
      }

      loading.dismiss();
    }, (error) => {
      this.alertService.showError(error.message);
      loading.dismiss();
    });
  }

  goMapa(historico) {
    this.navCtrl.push(MapaPage, {historico: historico});
  }
}
