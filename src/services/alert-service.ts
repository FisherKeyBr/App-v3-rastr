import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";

@Injectable()
export class AlertService {
  constructor(public toastCtrl: ToastController) {

  }

  showAlert(message, duration, position, cssClass){
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration || 3000,
      position: position || 'top',
      cssClass: cssClass || 'normalToast'
    });

    toast.present();
  }
}
