import { CargoAgent } from './../_models/view-models/cargo-agent/cargo-agent.model';
import { TokenData } from './../_models/token-data.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../core/services/base.service';
import { User } from '../_models/user.model';
import { CryptoService } from '../shared/services/crypto.service';
import { Router } from '@angular/router';
import { CargoAgentRM } from '../_models/request-models/register/cargo-agent-rm.model';
import { AuthenticateRM } from '../_models/request-models/login/authenticate-rm.model';
import { CargoAgentQuery } from '../_models/queries/cargo-agent/cargo-agent-query.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {
  baseUrl = environment.baseEndpoint;
  private currentUserSource: BehaviorSubject<User|null>;
  currentUser$: Observable<User| null>;

  constructor(http: HttpClient,
    private cryptoService: CryptoService,
    private toastr: ToastrService,
    private router: Router) {
    super(http);
    this.currentUserSource = new BehaviorSubject<User|null>(null);
    this.currentUser$ = this.currentUserSource.asObservable();
  }

  register(cargoAgent: CargoAgentRM){
    return this.post<any>('cargoagent', cargoAgent);
  }

  getUserDetail(query: CargoAgentQuery) {
    var params = new HttpParams();
    if (query.appUserId) {
      params = params.append("appUserId", query.appUserId);
    }
    if (query.isCountryInclude) {
      params = params.append("isCountryInclude", query.isCountryInclude);
    }
    return this.getWithParams<CargoAgent>('cargoagent',params);
  }

  login(model: AuthenticateRM) {
    return this.http.post(this.baseUrl + 'user/cargo-agent-authenticate', model, { withCredentials: true }).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this.saveUserCredential(model);
          return user;
        }
      })
    )
  }

  refreshToken(token?: string) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post(this.baseUrl + 'user/refresh-token', '"' + token + '"', httpOptions).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          return user;
        }
      })
    )
  }

  logout(optionalErrorMessage? : string) {
    if(optionalErrorMessage)
    this.toastr.error(optionalErrorMessage);

    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigate(['/account']);
  }

  setCurrentUser(user: User) {
    this.startRefreshTokenTimer(user);
    var encriptedUser = this.cryptoService.encrypt(JSON.stringify(user));
    localStorage.setItem('user', encriptedUser);
    this.currentUserSource.next(user);
  }

  removeCurrentUser() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken<TokenData>(token);
    return decodedToken;
  }

  private refreshTokenTimeout: any;

  private startRefreshTokenTimer(user: User) {
      // parse json object from base64 encoded jwt token
      const jwtToken = JSON.parse(atob(user.jwtToken.split('.')[1]));

      // set a timeout to refresh the token a minute before it expires
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken(user.refreshToken).subscribe(), timeout);
  }

  saveUserCredential(model: AuthenticateRM){
    if(model.rememberMe){
      var enriptedCredentil = this.cryptoService.encrypt(JSON.stringify(model));
      localStorage.setItem('UserCredential', enriptedCredentil);
    }else{
      localStorage.removeItem('UserCredential');
    }
  }
}
