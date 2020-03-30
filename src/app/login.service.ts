import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  login(email: String, password: String, rememberUser: Boolean, callback: Function): void {
    this.httpClient.get(`http://localhost:3000/users?email=${email}&password=${password}`).subscribe(resp => {
      try {
        if(typeof resp[0] != undefined) {
          this.setLogged(true);
          this.setUser_id(resp[0].id);
          this.setRemember_me(rememberUser);
          this.setUser_name(resp[0].name);
          this.setExpireTime();
          callback(true);
        }
      } catch(e) {
        console.log(e);
        callback(false, e);
      }
    })
  }

  logoff() {
    this.setLogged(false);
  }

  mustLogin(): Boolean {
    return this.getLogged() == 'false' || this.getLogged() == '' || (this.getRemember_me() == 'false' && this.isExpired());
  }

  setExpireTime(): void {
    this.setExpire_in((new Date()).getTime() + 120000);
  }

  private isExpired(): Boolean {
    return (new Date()).getTime().toString() >= this.getExpire_in();
  }

  private getLogged(): String {
    return this.cookieService.get('logged');
  }

  private setLogged(value: Boolean): void {
    this.cookieService.set('logged', value.toString());
  }

  getUser_id(): String {
    return this.cookieService.get('user_id');
  }

  private setUser_id(value: Number): void {
    this.cookieService.set('user_id', value.toString());
  }

  private getRemember_me(): String {
    return this.cookieService.get('remember_me');
  }

  private setRemember_me(value: Boolean): void {
    this.cookieService.set('remember_me', value.toString());
  }

  private getExpire_in(): String {
    return this.cookieService.get('expire_in');
  }

  private setExpire_in(value: Number): void {
    this.cookieService.set('expire_in', value.toString());
  }

  getUser_name() {
    return this.cookieService.get('user_name');
  }

  private setUser_name(value: String) {
    this.cookieService.set('user_name', value.toString());
  }
}
