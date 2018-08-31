import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {google} from "google-maps";

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  historicos: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.historicos = this.navParams.get('historicos');
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    /**
     let historico:any = this.historicos[this.historicos.length-1] || new HistoricoVeiculo();
     let latLng = new google.maps.LatLng(historico.GPSPoint_lat, historico.GPSPoint_lon);

     let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

     this.addMarkersMap();
     */
  }

  addMarkersMap() {
    /**
     for (var x = this.historicos.length - 1, y = 0; y < x; x--) {
      let historico: HistoricoVeiculo = this.historicos[x] || new HistoricoVeiculo();
      let latLng = new google.maps.LatLng(historico.GPSPoint_lat, historico.GPSPoint_lon);

      let marker: google.maps.Marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      marker.setMap(this.map);
     */
  }
}

