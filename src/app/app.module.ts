import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from '@ionic-native/keyboard';
import {LoginService} from "../services/login-service";

import {MyApp} from "./app.component";
import {LoginPage} from "../pages/login/login";
import {VeiculosPage} from "../pages/veiculos/veiculos";
import {HistoricoPage} from "../pages/historico/historico";
import {AlertService} from "../services/alert-service";
import {NotificationsPage} from "../pages/notifications/notifications";
import {SettingsPage} from "../pages/settings/settings";
import {VeiculoService} from "../services/veiculo-service";

// import services
// end import services
// end import services

// import pages
// end import pages

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    VeiculosPage,
    HistoricoPage,
    NotificationsPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot({
      name: '__db',
        driverOrder: ['indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    VeiculosPage,
    HistoricoPage,
    NotificationsPage,
    SettingsPage
  ],
  providers: [
    LoginService,
    AlertService,
    VeiculoService,
    StatusBar,
    SplashScreen,
    Keyboard
  ]
})

export class AppModule {
}
