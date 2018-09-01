import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {google} from "google-maps";
import {VeiculoService} from "../../services/veiculo-service";
import {LoginPage} from "../login/login";
import {LoginService} from "../../services/login-service";
import {AlertService} from "../../services/alert-service";

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  historicos: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public veiculoService: VeiculoService,
              public loginService: LoginService,
              public alertService: AlertService,
              public loadingCtrl: LoadingController) {
    this.historicos = [];
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  ionViewWillEnter() {
    if (!this.loginService.usuarioLogado) {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  loadMap() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Buscando histórico...'
    });

    loading.present();

    this.veiculoService.getHistoricoVeiculo(this.navParams.get('deviceId')).subscribe((retorno) => {
      this.historicos = retorno || [];
      this.addMarkersMap();
      loading.dismiss();
    }, (error) => {
      this.alertService.showError(error.message);
      loading.dismiss();
    });
  }

  addMarkersMap() {
    let latitude = -23.533773, longitude = -46.625290;

    if (!!this.historicos && this.historicos.length > 0) {
      latitude = this.historicos[0].latitude;
      longitude = this.historicos[0].longitude;

      this.historicos[0].icon = '../../assets/icon/car.png';
    }

    let latLng = new google.maps.LatLng(latitude, longitude);

    let mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    for (var x = 0, y = this.historicos.length; x < y; x++) {
      let historico: any = this.historicos[x];
      let latLng = new google.maps.LatLng(historico.latitude, historico.longitude);

      let marker: google.maps.Marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: (historico.icon || '../../assets/icon/pin.png')
      });

      let batteryImg = '';

      if (parseInt(historico.batteryLevel) <= 0) {
        batteryImg = '<img style="float: right" src="../../assets/icon/battery_min.png">';
      } else {
        batteryImg = '<img style="float: right" src="../../assets/icon/battery_max.png">';
      }

      var infowindow = new google.maps.InfoWindow({
        content: '<div>' +
          '<b>Endereço: </b> ' + historico.address + '<br>' +
          '<b>Odómetro: </b>' + (historico.odometerKM || 0).toFixed(2) + '/KM<br>' +
          '<b>Última conexão: </b>' + historico.ultima_conexao + '<br>' +
          '<b>Velocidade: </b>' + historico.speedKPH + '/KPH ' + batteryImg + '<br>' +
          '</div>',
        maxWidth: 200
      });

      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
      });

      marker.setMap(this.map);
      infowindow.open(this.map, marker);
    }
  }
}

