import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username;
  password;
  logining = false;
  message;
  remember;
  login() {
    this.logining = true;
    this.service.login({ username: this.username, password: this.password }).subscribe(() => {
      if (!this.service.isLogin) {
        this.message = '用户名或密码错误，请重试！';
        setTimeout(() => this.message = '', 2000);
      } else {
        if (this.remember) {
          localStorage.setItem('autoLogin', JSON.stringify({ username: this.username, password: this.password }));
        } else {
          localStorage.removeItem('autoLogin');
        }
        this.username = this.password = '';
        this.message = '';
      }
      this.logining = false;
    });
  }
  register() {
    if (this.username && this.password) {
      this.service.register({ username: this.username, password: this.password }).subscribe(res => {
        if (res.state) {
          this.message = '注册完成，正在登陆...';
          this.login();
        } else {
          this.message = '用户名已存在，请重试！';
          setTimeout(() => this.message = '', 2000);
        }
      });
    } else {
      this.message = '用户名或密码不能为空！';
      setTimeout(() => this.message = '', 2000);
    }
  }
  constructor(private service: LoginService) { }
  ngOnInit() {
    const user = this.service.autoLogin();
    if (user) {
      ({ username: this.username, password: this.password } = user);
      this.remember = true;
    }
  }

}
