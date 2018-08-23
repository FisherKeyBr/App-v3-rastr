import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class VeiculoService {
  constructor(private http: HttpClient) {

  }

  getContaComVeiculos(id, token) {
    let params = {
      account: token.account,
      password: token.password,
      user: token.user,
      id: id || 'all'
    };

    return this.http.post('http://95.85.11.175:8063/getVeiculos', params);
  }
}
