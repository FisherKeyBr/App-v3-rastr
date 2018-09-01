import {Component} from "@angular/core";
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {NavController, MenuController, LoadingController} from "ionic-angular";
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
  servidor: any;

  constructor(public nav: NavController, public menu: MenuController, private formBuilder: FormBuilder,
              public loginService: LoginService, public alertService: AlertService,
              public loadingCtrl: LoadingController, public storage: Storage) {
    this.menu.swipeEnable(false);
    this.credential = new Credential();

    this.servidor = {};

    this.loginForm = this.formBuilder.group({
      account: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // login and go to home page
  login() {
    if (!this.loginForm.valid) {
      this.alertService.showAlert('É necessário preencher todos os campos obrigatórios!');
      return;
    }

    if (!!this.servidor.isLogarOutroServidor && !this.servidor.ipServidor) {
      this.alertService.showAlert('É necessário informar o IP do servidor para logar.');
      return;
    }

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Verificando credenciais...'
    });

    loading.present();

    this.loginService.login(this.credential, this.servidor).subscribe((dados) => {
      loading.dismiss();
      this.onLoginResult(dados);
    }, (error) => {
      this.alertService.showError('Houve um erro ao logar no servidor - ' + (error.message || '[CONEXÃO BANCO]'));
      loading.dismiss();
    });
  }

  onLoginResult(isAutenticado) {
    if (!isAutenticado) {
      this.alertService.showError('Os credenciais estão incorreto!');
    } else {
      this.storage.set('usuarioLogado', this.credential).then(() => {
        this.loginService.usuarioLogado = Object.assign(new Credential(), this.credential);
        this.nav.setRoot(VeiculosPage);
      });
    }
  }

  ionViewWillEnter() {
    //verificar e pegar o token do usuário logado
    this.storage.ready().then(() => {
      this.storage.get('usuarioLogado').then((token) => {
        this.loginService.usuarioLogado = Object.assign(new Credential(), token);

        if (!!this.loginService.usuarioLogado.account &&
          !!this.loginService.usuarioLogado.user &&
          !!this.loginService.usuarioLogado.password) {
          this.nav.setRoot(VeiculosPage);
        }
      });
    });
  }
}
