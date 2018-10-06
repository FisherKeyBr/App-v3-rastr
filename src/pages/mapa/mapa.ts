import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {google} from "google-maps";
import {VeiculoService} from "../../services/veiculo-service";
import {LoginPage} from "../login/login";
import {LoginService} from "../../services/login-service";
import {AlertService} from "../../services/alert-service";
import {AlertaVeiculoEnum} from "../../enums/alerta-veiculo";
import {Observable} from 'Rxjs/rx';
import {Subscription} from "rxjs/Subscription";
import leaflet from 'leaflet';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  Osmap: any;
  historicos: any;
  tipoMapa: string;
  batteryOSControl: any;
  refreshHistoryFunc: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public veiculoService: VeiculoService,
              public loginService: LoginService,
              public alertService: AlertService,
              public loadingCtrl: LoadingController) {
    this.historicos = [];
    this.tipoMapa = 'google';
  }

  ionViewDidEnter() {
    this.loadMap();

    this.refreshHistoryFunc = Observable.interval(45000).subscribe(() => {
      this.loadMap();
    });
  }

  ionViewDidLeave(){
    this.refreshHistoryFunc.unsubscribe();
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

      if (this.tipoMapa === 'google') {
        this.addGoogleMarkersMap();
      } else {
        this.addOpenStreetMarkersMap();
      }

      loading.dismiss();
    }, (error) => {
      this.alertService.showError(error.message);
      loading.dismiss();
    });
  }

  /**
   * The CenterControl adds a control to the map that recenters the map on
   * Chicago.
   * This constructor takes the control DIV as an argument.
   * @constructor
   */
  placeBatteryComponentGoogleMap(controlDiv, historico) {
    let batteryImg = '';

    if (parseInt(historico.batteryLevel) <= 0) {
      batteryImg = '../../assets/icon/battery_min.png';
    } else {
      batteryImg = '../../assets/icon/battery_max.png';
    }

    // Set CSS for the control border.
    let controlUI = document.createElement('img');
    controlUI.src = batteryImg;
    controlUI.style.marginBottom = '22px';
    controlDiv.appendChild(controlUI);
  }

  placeBatteryComponentOSMap(historico) {
    let batteryImg = '';

    if (parseInt(historico.batteryLevel) <= 0) {
      batteryImg = '../../assets/icon/battery_min.png';
    } else {
      batteryImg = '../../assets/icon/battery_max.png';
    }

    //logo position: bottomright, topright, topleft, bottomleft
    this.batteryOSControl = leaflet.control({position: 'bottomleft'});

    this.batteryOSControl.onAdd = function () {
      var div = leaflet.DomUtil.create('div', 'os-battery');
      div.innerHTML = "<img src='" + batteryImg + "'>";
      return div;
    };

    this.batteryOSControl.addTo(this.Osmap);
  }

  addOpenStreetMarkersMap() {
    let latitude = -23.533773, longitude = -46.625290;

    if (!!this.historicos && this.historicos.length > 0) {
      latitude = this.historicos[0].latitude;
      longitude = this.historicos[0].longitude;
    }

    if(this.Osmap){
      this.Osmap.off();
      this.Osmap.remove();
    }

    this.Osmap = leaflet.map('osmap', {
      center: [latitude, longitude],
      zoom: 16
    });

    leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'edupala.com © ionic LeafLet'
    }).addTo(this.Osmap);

    var icon = leaflet.icon({
      iconUrl: '../../assets/icon/car.png'
    });

    this.placeBatteryComponentOSMap(this.historicos[0]);

    for (var x = 0, y = this.historicos.length; x < y; x++) {
      let historico: any = this.historicos[x];
      this.setOSWindowMarkerInfo(historico, icon);
    }
  }

  setOSWindowMarkerInfo(historico, icon) {
    var marker = new leaflet.Marker([historico.latitude, historico.longitude], {icon: icon});
    this.Osmap.addLayer(marker);

    let ignitionImg = '';

    if (historico.statusCode === AlertaVeiculoEnum.IGNICAO_LIGADA) {
      ignitionImg = '<b>Ignição: </b><br>' + '<img style="background-color: transparent" src="../../assets/icon/ignicao_ligada.jpeg">';
    } else {
      ignitionImg = '<b>Ignição: </b><br>' + '<img style="background-color: transparent" src="../../assets/icon/ignicao_desligada.jpeg">';
    }

    marker.bindPopup('<div>' +
      '<b>Endereço: </b> ' + historico.address + '<br>' +
      '<b>Odómetro: </b>' + (historico.odometerKM || 0).toFixed(2) + '/KM<br>' +
      '<b>Última conexão: </b>' + historico.ultima_conexao + '<br>' +
      '<b>Velocidade: </b>' + historico.speedKPH + '/KPH <br>' +
      ignitionImg + '<br>' +
      '</div>', {maxWidth: 200}).openPopup();
  }

  addGoogleMarkersMap() {
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

    let centerControlDiv: any = document.createElement('div');
    this.placeBatteryComponentGoogleMap(centerControlDiv, this.historicos[0]);

    centerControlDiv.index = 1;
    this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

    for (var x = 0, y = this.historicos.length; x < y; x++) {
      let historico: any = this.historicos[x];
      this.setGoogleWindowMarkerInfo(historico);
    }
  }

  setGoogleWindowMarkerInfo(historico) {
    let latLng = new google.maps.LatLng(historico.latitude, historico.longitude);

    let marker: google.maps.Marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: (historico.icon || '../../assets/icon/pin.png')
    });

    let ignitionImg = '';

    if (historico.statusCode === AlertaVeiculoEnum.IGNICAO_LIGADA) {
      ignitionImg = '<b>Ignição: </b><br>' + '<img style="background-color: transparent" src="../../assets/icon/ignicao_ligada.jpeg">';
    } else {
      ignitionImg = '<b>Ignição: </b><br>' + '<img style="background-color: transparent" src="../../assets/icon/ignicao_desligada.jpeg">';
    }

    var infowindow = new google.maps.InfoWindow({
      content: '<div>' +
        '<b>Endereço: </b> ' + historico.address + '<br>' +
        '<b>Odómetro: </b>' + (historico.odometerKM || 0).toFixed(2) + '/KM<br>' +
        '<b>Última conexão: </b>' + historico.ultima_conexao + '<br>' +
        '<b>Velocidade: </b>' + historico.speedKPH + '/KPH <br>' +
        ignitionImg + '<br>' +
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

