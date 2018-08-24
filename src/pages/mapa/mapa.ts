import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {google} from "google-maps";
import {HistoricoVeiculo} from "../../model/historico-veiculo";

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  historicos: Array<HistoricoVeiculo>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.historicos = this.navParams.get('historicos') || new Array<HistoricoVeiculo>();
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    let historicoAtual: HistoricoVeiculo = this.historicos[this.historicos.length - 1] || new HistoricoVeiculo();
    let latitudeAtual = historicoAtual.GPSPoint_lat || -34.9290;
    let longitudePadrao = historicoAtual.GPSPoint_lon || 138.6010;

    let latLng = new google.maps.LatLng(latitudeAtual, longitudePadrao);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let marker: google.maps.Marker = new google.maps.Marker({
      position: latLng,
      title: 'Hello World!'
    });

    marker.setMap(this.map);
  }
}
