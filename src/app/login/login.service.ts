import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChatService } from '../chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLogin = false;
  redirectTo;
  userInfo;
  autoLogin() {
    if (localStorage.getItem('autoLogin')) {
      return JSON.parse(localStorage.getItem('autoLogin'));
    } else {
      return null;
    }
  }
  login(info) {
    return this.http.post('/api/login', info).pipe(
      delay(2000),
      tap(res => {
        if (res.state) {
          this.isLogin = true;
          this.userInfo = res.data;
          if (this.redirectTo) {
            this.router.navigateByUrl(this.redirectTo);
          }
        }
      })
    );
  }
  logout() {
    this.isLogin = false;
    this.redirectTo = '';
    this.chat.disconnectSocket();
  }
  register(info) {
    return this.http.post('api/register', info);
  }
  constructor(private http: HttpClient, private router: Router, private chat: ChatService) { }
}
