import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {LoginService} from "../../services/login-service";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public nav: NavController, public loginService: LoginService) {

  }

  // logout
  logout() {
    this.loginService.logout();
    this.nav.setRoot(LoginPage);
  }
}
