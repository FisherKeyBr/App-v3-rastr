import {Component} from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';
import {LoginService} from "../../services/login-service";
import {NotificationsPage} from "../notifications/notifications";
import {SettingsPage} from "../settings/settings";
import {LoginPage} from "../login/login";
import {Veiculo} from "../../model/veiculo";
import {VeiculoService} from "../../services/veiculo-service";

@Component({
  selector: 'page-veiculos',
  templateUrl: 'veiculos.html'
})
export class VeiculosPage {
  veiculos: Veiculo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public loginService: LoginService,
    public veiculoService: VeiculoService
  ) {
    veiculoService.getVeiculos('all').then((token) => {
      token.subscribe(dados => {
        this.veiculos = <Veiculo>dados['DeviceList'];
      });
    });
  }

  ionViewWillEnter() {
    this.loginService.getUsuarioLogado().then(usuario => {
      if (!usuario) {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  // to go account page
  goToAccount() {
    this.navCtrl.push(SettingsPage);
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create(NotificationsPage);
    popover.present({
      ev: myEvent
    });
  }
}
