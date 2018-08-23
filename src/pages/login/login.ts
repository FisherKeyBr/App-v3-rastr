import {Component} from "@angular/core";
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {NavController, MenuController} from "ionic-angular";
import {Credential} from "../../model/credential";
import {LoginService} from "../../services/login-service";
import {VeiculosPage} from "../veiculos/veiculos";
import {AlertService} from "../../services/alert-service";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  credential: Credential;
  loginForm: FormGroup;

  constructor(public nav: NavController, public menu: MenuController, private formBuilder: FormBuilder,
              public loginService: LoginService, public alertService: AlertService,
              public storage: Storage) {
    this.menu.swipeEnable(false);
    this.credential = new Credential();

    this.loginForm = this.formBuilder.group({
      account: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.executarChamadasInicial();
  }

  // login and go to home page
  login() {
    if (!this.loginForm.valid) {
      this.alertService.showAlert('É necessário preencher todos os campos obrigatórios!',
        null, 'bottom', 'errorToast');
      return;
    }

    this.loginService.login(this.credential).subscribe((dados) => {
      this.onLoginResult(dados);
    });
  }

  onLoginResult(dados) {
    if (!!dados['Error']) {
      this.alertService.showAlert('Os credenciais estão incorreto!', null, 'bottom', 'errorToast');
    } else {
      this.storage.set('usuarioLogado', this.credential);
      this.nav.setRoot(VeiculosPage);
    }
  }

  executarChamadasInicial() {
    this.loginService.getUsuarioLogado().then((token) => {
      if (!!token) {
        this.nav.setRoot(VeiculosPage);
      }
    });
  }
}
