import {Component} from "@angular/core";
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {NavController, MenuController, LoadingController} from "ionic-angular";
import {Credential} from "../../model/credential";
import {LoginService} from "../../services/login-service";
import {VeiculosPage} from "../veiculos/veiculos";
import {AlertService} from "../../services/alert-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  credential: Credential;
  loginForm: FormGroup;

  constructor(public nav: NavController, public menu: MenuController, private formBuilder: FormBuilder,
              public loginService: LoginService, public alertService: AlertService,
              public loadingCtrl: LoadingController) {
    this.menu.swipeEnable(false);
    this.credential = new Credential();

    this.loginForm = this.formBuilder.group({
      account: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // login and go to home page
  login() {
    if (!this.loginForm.valid) {
      this.alertService.showAlert('É necessário preencher todos os campos obrigatórios!',
        null, 'bottom', 'errorToast');
      return;
    }

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando credenciais...'
    });

    loading.present();

    this.loginService.login(this.credential).subscribe((dados) => {
      loading.dismiss();
      this.onLoginResult(dados);
    }, loading.dismiss);
  }

  onLoginResult(isAutenticado) {
    if (!isAutenticado) {
      this.alertService.showAlert('Os credenciais estão incorreto!', null, 'bottom', 'errorToast');
    } else {
      localStorage.setItem('usuarioLogado', JSON.stringify(this.credential));
      this.nav.setRoot(VeiculosPage);
    }
  }

  ionViewWillEnter() {
    if (!!this.loginService.getUsuarioLogado()) {
      this.nav.setRoot(VeiculosPage);
    }
  }
}
