import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";

@Injectable()
export class AlertService {
  constructor(public toastCtrl: ToastController) {

  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'alertToast'
    });

    toast.present();
  }

  showInfo(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'normalToast'
    });

    toast.present();
  }

  showError(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'errorToast'
    });

    toast.present();
  }
}
